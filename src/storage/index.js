const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.TABLE_NAME || '';
const PRIMARY_KEY = process.env.PRIMARY_KEY || '';

//
// TODO: rewirte this to be use like spbot's firestore one.
// Add other tables dor storing messages?
//
const addToBotTable = async (requestedId, data = {}) => {
  const params = {
    TableName: TABLE_NAME,
    Item: {
      [PRIMARY_KEY]: requestedId,
      ...data
    }
  };
  try {
    await db.put(params).promise();
    return { statusCode: 201, body: params.item };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};

const getFromBotTable = async (requestedId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: {
      [PRIMARY_KEY]: requestedId
    }
  };

  try {
    const response = await db.get(params).promise();
    return { statusCode: 200, body: response.Item };
  } catch (dbError) {
    return { statusCode: 500, body: JSON.stringify(dbError) };
  }
};

module.exports = {
  addToBotTable,
  getFromBotTable
};
