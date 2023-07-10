from operator import itemgetter
from typing import List
from fastapi import FastAPI, HTTPException
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import datetime
from fastapi.responses import StreamingResponse
from io import StringIO
import io
from fastapi.responses import FileResponse
import os
import csv
from urllib.parse import quote
import codecs

from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles

app = FastAPI()
app.mount("/images", StaticFiles(directory="images"), name="images")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB 연결 설정
# client = MongoClient('mongodb://lia:1234@mongodb:27017')
client = MongoClient('mongodb://localhost:27017')
db = client['nasdata']
collection = db['imagesdata']

#화면상 dashboard -> datacondition.js
@app.get("/api/data/count-by-classname")
def get_classname_cnt():
    pipeline = [
        {"$group": {
            "_id": "$Tag.Category",
            "distinctClassCount": {"$addToSet": "$ClassName"}
        }},
        {"$group": {
            "_id": None,
            "TotalDistinctClassCount": {"$sum": {"$size": "$distinctClassCount"}}
        }},
        {"$project": {
            "_id": 0,
            "TotalDistinctClassCount": 1
        }}
    ]
    result = list(collection.aggregate(pipeline))
    print(f"result :  {result}")
    total_count = result[0]["TotalDistinctClassCount"] if result else 0
    print(f"Total Distinct Class Count: {total_count}")

    return {"result": total_count}

#화면상 dashboard -> classcnt.js
@app.get("/api/data/total-count")
def get_total_count():
    pipeline = [
        {"$group": {"_id": None, "count": {"$sum": 1}}}
    ]
    result = list(collection.aggregate(pipeline))
    total_count = result[0]["count"] if result else 0
    print(f"Total Count: {total_count}")

    return {"total_count": total_count}

#화면상 dashboard -> orders.js
@app.get("/api/data/category-total-count")
def get_total_count():
    pipeline = [
        {"$group": {
            "_id": "$Tag.Category",
            "count": {"$sum": 1},
            "distinctClassNames": {"$addToSet": "$ClassName"}
        }},
        {"$project": {
            "_id": 0,
            "Category": "$_id",
            "ImageCount": "$count",
            "DistinctClassCount": {"$size": "$distinctClassNames"}
        }}
    ]
    result = list(collection.aggregate(pipeline))
    print(f"Category result: {result}")

    return {"categories": result}

#화면상 Nasdata.js -> Class List
@app.get("/treeview")
def get_treeview_data():
    pipeline = [
        {"$sort": {"Depth1": 1, "Depth2": 1, "Depth3": 1, "Depth4": 1, "Depth5": 1, "ClassName": 1, "ImageName": 1}}
    ]
    result = list(collection.aggregate(pipeline))
    treeview_data = []

    depth_keys = ["Depth1", "Depth2", "Depth3", "Depth4", "Depth5"]  # Define the depth keys

    for data in result:
        node = treeview_data
        node_id = str(data["_id"])  # _id 값을 문자열로 변환하여 사용
        #print(f"node_id : {node_id}")

        for depth_key in depth_keys:
            depth = data.get("Depth", {}).get(depth_key)  # Check if depth_key exists in the data
            if not depth:
                break  # If depth_key is missing, exit the loop

            item = next((item for item in node if item["text"] == depth and item["Depth"] == depth_key), None)

            if not item:
                item = { "id": node_id,"text": depth, "Depth": depth_key, "children": []}
                node.append(item)

            node = item["children"]

        ClassName = data.get("ClassName")
        ImageName = data.get("ImageName")

        if ClassName is None:
            ClassName = "None"  # Set a default value for ClassName if it's None

        if ImageName is None:
            ImageName = "None"  # Set a default value for ImageName if it's None

        class_item = next((item for item in node if item["text"] == ClassName and item["Depth"] == "ClassName"), None)
        if not class_item:
            class_item = { "id": node_id,"text": ClassName, "Depth": "ClassName", "children": []}
            node.append(class_item)

        #class_item["children"].append({"text": ImageName, "Depth": "ImageName"})
        class_item["children"].append({"text": ImageName, "Depth": "ImageName", "id": node_id})
    sorted_treeview_data = sort_treeview_data(treeview_data)

    return {"treeviewData": sorted_treeview_data}

def sort_treeview_data(treeview_data):
    sorted_data = sorted(treeview_data, key=itemgetter('text'))
    for item in sorted_data:
        children = item.get('children')
        if children:
            item['children'] = sort_treeview_data(children)
    return sorted_data

@app.post("/api/treeitem-click/{value}/{depth}/{id}")
async def get_image_paths(value: str,depth: str,id:str):
    print("value:", value)
    print("depth:", depth)
    image_urls = []
    
    filter_query = {
                "_id": ObjectId(id)
            }
    documents = list(collection.find(filter_query))
    print(f"Click documents2 : {documents}")
    for doc in documents:
        depth_values = doc["Depth"]
        print("Click depth_values : ", depth_values)
        #예외처리 : Depth(i)가 아닌 경우 -> depth가 ClassName이거나 ImageName인 경우
        if depth == "ClassName" or depth == "ImageName":
            depth_number = 5
        else:
            depth_number = int(depth[5:])
        #이들을 통해 Depth.Depth1 ~ Depth.{depth}까지의 Depth 요소들을 구함 => mathcing_depths
        matching_depths = {f"Depth{i}": depth_values.get(f"Depth{i}") for i in range(1, depth_number + 1)}
        print("Click matching_depths : ", matching_depths)

    #matching_documents = list(collection.find({"ClassName": value}))
    #print(f"matching_documents: {matching_documents}")
    if value == "None":
        matching_documents = list(collection.find({"ClassName": {"$type": "null"}}))
    else:
        matching_documents = list(collection.find({"ClassName": value}))
    #print(f"matching_documents: {matching_documents}")
    for document in matching_documents:
        depth_values2 = document["Depth"]
        print("Click depth_values2 : ", depth_values2)
        #예외처리 : Depth(i)가 아닌 경우 -> depth가 ClassName이거나 ImageName인 경우
        if depth == "ClassName" or depth == "ImageName":
            depth_number2 = 5
        else:
            depth_number2 = int(depth[5:])
        #이들을 통해 Depth.Depth1 ~ Depth.{depth}까지의 Depth 요소들을 구함 => mathcing_depths
        matching_depths2 = {f"Depth{i}": depth_values2.get(f"Depth{i}") for i in range(1, depth_number2 + 1)}
        #print("Click matching_depths2 : ", matching_depths2)
        if matching_depths == matching_depths2:
            image_path = document["CombinedData"]["image_path"]
            #print(f"image_path: {image_path}")
            
            matching_image_paths = [image_path.replace("/ai_team/vision/Erebor/test_images", "http://localhost:8000/images")]
            #print(f"matching_image_paths: {matching_image_paths}")

            image_urls.extend(matching_image_paths)
            #image_urls.append(matching_image_paths)
            #print(f"image_urls: {image_urls}")
    
    return {"image_urls": image_urls}

'''
    * matching_depths : Depth1부터 프론트로부터 전달받은 depth까지의 Depth요소들
    1. DB에서 label 값을 갖는 데이터들의 matching_depths를 구함
    2. id를 _id로 갖는 데이터의 matching_depths를 구함
    3. 1번 mathcing_depths와 2번 matching_depths가 같은 경우에 한에서 update함
        => 왜냐하면 클래스들 중 이름이 같은 경우가 있을 수 있어서 그것을 해결하기 위해 id를 사용했기떄문
'''
@app.post("/api/data/update/{depth}/{label}/{editingLabel}/{id}")
async def update_data(depth: str, label: str, editingLabel: str, id: str):
    try:
        #DB에서 label 값을 갖는 데이터를 모두 find
        filter_query = {
            "$or": [
                {f"Depth.{depth}": label},  #Depth에 딕셔너리 형태로 Depth1~5까지 묶여있음
                {"ClassName": label},
                {"ImageName": label}
            ]
        }
        documents = list(collection.find(filter_query))
        updated_count = 0       #단순히 업데이트 개수 셀려고 넣은 변수임

        #DB에서 id를 _id로 갖는 데이터 find
        filter_query2 = {
                "_id": ObjectId(id)
            }
        documents2 = list(collection.find(filter_query2))
        
        #label값이 같은 애들 중
        for doc in documents:
            
            #Depth 요소들을 다 가져와서 
            depth_values = doc["Depth"]
            #예외처리 : Depth(i)가 아닌 경우 -> depth가 ClassName이거나 ImageName인 경우
            if depth == "ClassName" or depth == "ImageName":
                depth_number = 5
            else:
                depth_number = int(depth[5:])
            #이들을 통해 Depth.Depth1 ~ Depth.{depth}까지의 Depth 요소들을 구함 => mathcing_depths
            matching_depths = {f"Depth{i}": depth_values.get(f"Depth{i}") for i in range(1, depth_number + 1)}

            #위의 데이터들 중 id와 _id가 같은 데이터의 mathcing_depths가 같은 경우에만 업데이트 할 것
            for doc2 in documents2:
                depth_values2 = doc2["Depth"]

                if depth == "ClassName" or depth == "ImageName":
                    depth_number2 = 5
                else:
                    depth_number2 = int(depth[5:])
                
                matching_depths2 = {f"Depth{i}": depth_values2.get(f"Depth{i}") for i in range(1, depth_number2 + 1)}
                print("matching_depths2 : ", matching_depths2)

                if matching_depths == matching_depths2:
                    print("depth : ", depth)
                    if depth in doc["Depth"]:
                        doc["Depth"][depth] = editingLabel
                        update_operation = {
                        "$set": {
                            f"Depth.{depth}": editingLabel,
                            "updated_at": datetime.now()
                            }
                        }
                    elif depth == "ClassName":
                        doc["ClassName"] = editingLabel
                        update_operation = {
                        "$set": {
                            "ClassName": editingLabel,
                            "updated_at": datetime.now()
                            }
                        }
                    elif depth == "ImageName":
                        doc["ImageName"] = editingLabel
                        update_operation = {
                        "$set": {
                            "ImageName": editingLabel,
                            "updated_at": datetime.now()
                            }
                        }
                        
                    collection.update_one({"_id": doc["_id"]}, update_operation)
                    updated_count += 1
                    print(f"updated_count : {updated_count}")

        return {"message": f"Updated {updated_count} documents, depth: {depth}, label: {label}, editingLabel: {editingLabel}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Label update failed")

@app.post("/api/download-csv")
async def download_csv(selectedClassNames: List[str]):
    try:
        #한글 깨짐 방지를 위하여 코드 수정
        csv_data = io.StringIO()
        writer = csv.writer(csv_data, delimiter=',', lineterminator='\n')
        # CSV 헤더 작성
        #writer.writerow(["Category","ClassName","Depth1", "Depth2", "Depth3", "Depth4", "Depth5", "ImagePath"])
        header = ["Tag","ClassName","Depth1", "Depth2", "Depth3", "Depth4", "Depth5", "ImagePath"]
        writer.writerow(header)
        
        #selectedClassNames가 리스트여서 $in 필요
        #ClassName일 경우 여러개 클릭해야할 수 있어서 그랬음
        filter_query = {
            "$or": [
                {"ClassName": {"$in": selectedClassNames}},
                {"ImageName": {"$in": selectedClassNames}},
                {"Depth.Depth1": {"$in": selectedClassNames}},
                {"Depth.Depth2": {"$in": selectedClassNames}},
                {"Depth.Depth3": {"$in": selectedClassNames}},
                {"Depth.Depth4": {"$in": selectedClassNames}},
                {"Depth.Depth5": {"$in": selectedClassNames}}
            ]
        }

        # 선택된 클래스 이름을 가지고 있는 데이터 조회
        print(f"filter_query{filter_query}")
        count = collection.count_documents(filter_query)
        print("ClassName 값을 가진 필드의 개수:", count)

        cursor =  list(collection.find(filter_query))

        for document in cursor:

            #아래의 요소들이 모두 들어있어야 CSV다운로드 가능 -> 뭐라도 빠져있으면 500 error 발생
            Tag = document["Tag"]
            ClassName = document["ClassName"]
            Depth1 = document["Depth"]["Depth1"]
            Depth2 = document["Depth"]["Depth2"]
            Depth3 = document["Depth"]["Depth3"]
            Depth4 = document["Depth"]["Depth4"]
            Depth5 = document["Depth"]["Depth5"]
            Image_path = document["CombinedData"]["image_path"]

            #writer.writerow([Category,ClassName,Depth1, Depth2, Depth3, Depth4, Depth5,Image_path])
            row = [Tag,ClassName,Depth1, Depth2, Depth3, Depth4, Depth5,Image_path]
            writer.writerow(row)

        # StringIO를 파일 포인터 처럼 사용하여 파일 내용을 스트리밍으로 전송
        csv_data.seek(0)
        #한글깨짐 방지 필요 -> UTF-8(BOM)으로 다운로드 받아야함
        csv_encoded = codecs.BOM_UTF8 + csv_data.getvalue().encode('utf_8_sig')
        csv_data = io.BytesIO(csv_encoded)

        return StreamingResponse(csv_data, media_type='text/csv', headers={'Content-Disposition': 'attachment; filename=EreborData.csv'})
    except Exception as e:
        raise HTTPException(status_code=500, detail="CSV download failed")
    
