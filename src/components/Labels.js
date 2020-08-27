import React, {useState} from 'react';
import { dynamodb, docClient } from '../config/aws.config';

export default function Labels(props) {
  const [selectedLabel, setSelectedLabel] = useState('');
  const [state, setState] = useState({
    part: '',
    quantity: '',
    serial: '',
    duplicate: false,
    concluded: false,
    unsure: true,
  })
  const {label} = props

  function getFields(id) {
    const selectedItem = label.find((lbl, index) => index === id)
    const fileName = Object.values(selectedItem)[0]
    setSelectedLabel(fileName)
  }

    function handleChange(evt) {
      const value =
        evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
      setState({
        ...state,
        [evt.target.name]: value
      });
    }

  function saveLabelInfo(event) {
    event.preventDefault()
    console.log(selectedLabel)
    let params = {
      endpoint: 'dynamodb.us-east-2.amazonaws.com',
      TableName: "rushlabel",
      Key: { id: 1595841350},
      Item: {
        id: parseInt(selectedLabel.split('_')[1]),
        fileName: selectedLabel,
        part: state.part,
        quantity: state.quantity,
        serial: state.serial,
        duplicate: state.duplicate,
        concluded: state.concluded,
        unsure: state.unsure
      }
    };

    docClient.put(params, function (err, data) {
      if (err) {
        console.log(err);
      } else {
       console.log('dave to dab')
      }
    });
  }

  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        <ul className="Labels">
        {label.map((lbl, idx) => {
            const k = Object.values(lbl)
            return <li key={idx}><button onClick={() => getFields(idx)}>{k[0]}</button></li>
        })}
        </ul>
      </div>
      <div className="SplitPane-right">
        <div className="LabelFields">

          <div className="form-fields">
            <label htmlFor="part">Part#: </label>
            <input type="text" name="part" value={state.part} onChange={handleChange}/>
          </div>
          <div className="form-fields">
            <label htmlFor="quantity">Quantity: </label>
            <input type="text" name="quantity" onChange={handleChange} value={state.quantity}/>
          </div>
          <div className="form-fields">
            <label htmlFor="serial">Serial: </label>
            <input type="text" name="serial" onChange={handleChange} value={state.serial} />
          </div>

          <div className="form-fields-checks">
            <div className="form-fields">
              <label htmlFor="duplicate">Duplicate: </label>
              <input type="checkbox" name="duplicate" onChange={handleChange} checked={state.duplicate} />
            </div>

            <div className="form-fields">
              <label htmlFor="concluded">Concluded: </label>
              <input type="checkbox" name="concluded" onChange={handleChange} checked={state.concluded} />
            </div>

            <div className="form-fields">
              <label htmlFor="unsure">Unsure: </label>
              <input type="checkbox" name="unsure" onChange={handleChange} checked={state.unsure} />
            </div>
          </div>
           <button type="Submit" onClick={saveLabelInfo}>Save</button>
        </div>
      </div>
    </div>
  )
}
