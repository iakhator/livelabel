import React, {useState, useEffect} from 'react';
import Labels from './Labels';
import { s3, params, docClient } from '../config/aws.config';

export default function LabelWrapper () {
  const [label, setLabel] = useState([]);
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    function buildDisplayObject(dataFromS3, db=false) {
      if(db) {
        return dataFromS3.map(data => {
          const mapObject = new Map()
           const key = data.fileName.split('_', 2)[1]
          mapObject[key] = data.fileName;
          mapObject.status = data.concluded;
          return mapObject
        } )
      }
      const labelData = extractFileNames(dataFromS3)
      return labelData.map((data) => {
          const mapObject = new Map()
          const key = data.split('_')[1]
          mapObject[key] = data;
          mapObject.status = false;
          return mapObject
      })
    }
    
    const getLabels = async () => {
      let allFiles = {};
      let dataFromS3;
      let lbl;

      const [labelsFromDb, error] = await listFiles()
      if(error) {
        throw new Error('Server error')
      }
      const [data, err] = await getDataFromS3()

      if(err) {
        throw new Error('Server error')
      }
      dataFromS3 = data;
      lbl = buildDisplayObject(dataFromS3)
  

      if(labelsFromDb.length === 0)  {
        allFiles = lbl
      } else {
        const restructureData = buildDisplayObject(labelsFromDb, true)
        allFiles = Object.assign(lbl, restructureData)
        console.log(allFiles, 'restructureData')
      }
      setLabel(allFiles)
    }
    getLabels()
  }, [])

  const extractFileNames = (dataFromS3) => {
    return dataFromS3.slice(1).map((dt) => dt.Key.split('/')[1]);
  }


  const getDataFromS3 = async () => {
    try {
      const s3Data = await s3.listObjects(params).promise();
       return [s3Data.Contents, null]
    } catch (error) {
      return [null, error]
    }
  }
 
  const listFiles = async () => {
    try {
      let params = {
        TableName: "rushlabel",
        endpoint: 'dynamodb.us-east-2.amazonaws.com'
      };
      const result = await docClient.scan(params).promise()
      return [result.Items, null]
    } catch (error) {
        return [null, error]
    }
  };

  const getParams = (items) => {
    let params = {
      endpoint: 'dynamodb.us-east-2.amazonaws.com',
      TableName: "rushlabel",
      Item: items,
      ReturnValues: 'ALL_OLD'
    }
   return params
  }

  // save labelled values in dynamo
 const saveLabelledInDB = (items) => {
    const params = getParams(items)
    docClient.put(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
        const {fileName, concluded} = data.Attributes
        const id = fileName.split('_', 2)[1]
        const savedData = Object.assing(label, { [id] : fileName, status: concluded})
        setLabel(savedData)

        console.log('dave to dab', { [id] : fileName, status: concluded})
        console.log(label)
      }
  })
 }

  return (
      <div className="left">
        <Labels label={label} saveLabelled={saveLabelledInDB}/>
      </div>
  );
}
