## 1. Insalling NodeJs
1. Go to NodeJs Website : https://nodejs.org/en
2. Download latest NodeJs package and install it.
3. Image Guide: <br />
![image info](./images/1.png)
4. Video Reference: <br />
Mac : https://www.youtube.com/watch?v=pHz7TgEIa0w <br />
Windows : https://www.youtube.com/watch?v=X-FPCwZFU_8

## 2. Running the Project
1. Clone the repository:
`git clone https://github.com/anantdahiya8/receipt-processor.git`, then `cd receipt-processor`
2. Install dependencies:
`npm install`
3. Start the dev server:
`npm start` or 
`nodemon --exec node server.js` to automatically restart the server on save.
4. Server will start on port 4000. (Urls: http://localhost:4000/receipts/process, http://localhost:4000/receipts/:id/points)


## 3. Running the Tests
1. Run the test:
`npm run test`