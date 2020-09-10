import React, {useState, useEffect} from 'react';
import Labels from './Labels';
import { s3, params, docClient } from '../config/aws.config';

export default function LabelWrapper () {
  const [label, setLabel] = useState([]);
  const [isRefresh, setIsRefresh] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {

     function buildDisplayObject(dataFromS3, db=false) {
      const labelData = db ? dataFromS3 : extractFileNames(dataFromS3)
      const uniqLabelData = [...new Set(labelData)];
    
      return uniqLabelData.map((data) => {
          const mapObject = new Map()
          const key = data.fileName ? data.fileName.split('_', 2)[1] : data.split('_')[1]
          mapObject.id = key
          mapObject[key] = data.fileName || data;
          mapObject.status = data.concluded || false;
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
  
      //check db for data
      if(labelsFromDb.length === 0)  {
        allFiles = lbl
      } else {
        const restructureData = buildDisplayObject(labelsFromDb, true)
        allFiles = Object.assign(lbl, restructureData)
      }

      allFiles = sortByTimestamp(allFiles)
      setLabel(allFiles)

      if(isRefresh) {
        setIsRefresh(false)
      }
    }
    getLabels()
  }, [isRefresh])

  const extractFileNames = (dataFromS3) => {
    return dataFromS3.slice(1).map((dt) => dt.Key.split('/')[1]);
  }

  const sortByTimestamp = (objs) =>{
    return objs.sort((a,b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0)); 
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
        endpoint: 'dynamodb.us-east-2.amazonaws.com',
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
    setIsSaving(true)
    const params = getParams(items)
    docClient.put(params, function (err, data) {
      if (err) {
        console.error(err);
        setIsSaving(false)
      } else {
        setIsRefresh(true)
        setIsSaving(false)
      }
  })
 }

  return (
      <div className="left">
        <Labels label={label} saveLabelled={saveLabelledInDB} isSaving={isSaving}/>
      </div>
  );
}
