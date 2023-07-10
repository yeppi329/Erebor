FROM node:14

WORKDIR /app

COPY package.json .
RUN npm install

# COPY . .

CMD ["npm","run","start"]
#Dockerfile에서 npm start를 하면 build되지 않은 소스폴더에서 바로 로드-> 성능에 치명적을 안 좋음
#npm start 가 아닌 npm run build한 결과물을 nginx에 사용해야 함