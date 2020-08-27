import React, {useState, useEffect} from 'react';
// import LabelFields from './LabelFields';
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

      const [labelsFromDb, error] = await onRead()
      if(error) {
        throw new Error('Server error')
      }
      const [data, err] = await getDataFromS3()

      if(error) {
        throw new Error('Server error')
      }
      dataFromS3 = data;
      lbl = buildDisplayObject(dataFromS3)
  

      if(labelsFromDb.length === 0)  {
        // console.log(lbl)
        allFiles = lbl
      } else {
        const restructureData = buildDisplayObject(labelsFromDb, true)
        allFiles = [...lbl, ...restructureData]
        console.log(allFiles, 'restructureData')
      }
      setLabel(allFiles)
        // console.log(labelsFromDb, 'data')
      // s3.listObjects(params, (err, data) => {
      //   if (err) throw err;
      //   const labelData = data.Contents.map((dt) => dt.Key.split('/')[1]);
      //   const mapObject = new Map()
      //   labelData.map((data) => {
      //     mapObject[data.split('_')[1]] = data
      //   })

      //   const sortedLabel = Object.keys(mapObject).map(function (key) {
      //     return mapObject[key];
      //   });
        
      //   setLabel(sortedLabel)
      // })
    }
    getLabels()
  }, [])

  const extractFileNames = (dataFromS3) => {
    return dataFromS3.slice(1).map((dt) => dt.Key.split('/')[1]);
  }

  // function buildDisplayObject(dataFromS3) {
  //   const labelData = extractFileNames(dataFromS3)
  //   return labelData.map((data) => {
  //     const mapObject = new Map()
  //     const key = data.split('_')[1]
  //     mapObject[key] = data;
  //     mapObject.status = false;
  //     return mapObject
  //   })
  // }

  const getDataFromS3 = async () => {
    try {
      const s3Data = await s3.listObjects(params).promise();
       return [s3Data.Contents, null]
    } catch (error) {
      return [null, error]
    }
  }
 
  const onRead = async () => {

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

      // return docClient.scan(params, function (err, data) {
      //   if (err) {
      //     console.log(err);
      //   } else {
      //     return data;
      //   }
      // });
    };


  return (
      <div className="left">
        <Labels label={label}/>
      </div>
  );
}
