from fastapi import APIRouter

from models.model import Model
from config.db import conn
from schemas.model import serializeDict,serializeList
from bson import ObjectId

model = APIRouter()

@model.get('/model')
async def find_all_models():
    print(conn.local.model.find())
    print(serializeList(conn.local.model.find()))
    return serializeList(conn.local.model.find())

@model.get('/model/{id}')
async def find_one_model(id):
    return serializeDict(conn.local.model.find_one({"_id":ObjectId(id)}))

@model.post('/model')
async def create_model(model: Model):
    conn.local.model.insert_one(dict(model))
    return serializeList(conn.local.model.find())

@model.put('/model/{id}')
async def update_model(id,model: Model):
    conn.local.model.find_one_and_update({"_id":ObjectId(id)},{"$set":dict(model)})
    return serializeDict(conn.local.model.find_one({"_id":ObjectId(id)}))

@model.delete('/model/{id}')
async def delete_model(id,model: Model):
    return serializeDict(conn.local.model.find_one_and_delete({"_id":ObjectId(id)}))