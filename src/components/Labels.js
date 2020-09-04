import React, {useState} from 'react';

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
  const {label, saveLabelled, isSaving} = props

  function getFields(id) {
    const selectedItem = label.find((lbl, index) => index === id)
    const fileName = Object.values(selectedItem)[0]
    setSelectedLabel(fileName)
  }

  function handleLive(id) {
    console.log(id)
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
    const items = {
        id: parseInt(selectedLabel.split('_')[1]),
        fileName: selectedLabel,
        part: state.part,
        quantity: state.quantity,
        serial: state.serial,
        duplicate: state.duplicate,
        concluded: state.concluded,
        unsure: state.unsure
      }

      saveLabelled(items)
    };

  return (
    <div className="SplitPane">
      <div className="SplitPane-left">
        <ul className="Labels">
        {label.map((lbl, idx) => {
          const k = Object.values(lbl)
          const fileName = k[0].split('.')[0]
          return <li key={idx}><button onClick={() => getFields(idx)} onFocus={() => handleLive(idx)}>{fileName}</button>{lbl.status && <span className="status">labelled</span>}</li>
        })}
        </ul>
      </div>
      <div className="SplitPane-right">
        <h1>Live Label Data</h1>
        {selectedLabel ? (<div className="LabelFields">
          <p>Curent Item: <strong>{selectedLabel}</strong></p>
          <div className="form-fields">
            <label htmlFor="part">Part#: </label>
            <input type="text" name="part" value={state.part} onChange={handleChange} required/>
          </div>
          <div className="form-fields">
            <label htmlFor="quantity">Quantity: </label>
            <input type="text" name="quantity" onChange={handleChange} value={state.quantity} required/>
          </div>
          <div className="form-fields">
            <label htmlFor="serial">Serial: </label>
            <input type="text" name="serial" onChange={handleChange} value={state.serial} required />
          </div>

          <div className="form-fields-checks">
            <div className="form-field">
              <label htmlFor="duplicate">Duplicate: </label>
              <input type="checkbox" name="duplicate" onChange={handleChange} checked={state.duplicate} />
            </div>

            <div className="form-field">
              <label htmlFor="concluded">Concluded: </label>
              <input type="checkbox" name="concluded" onChange={handleChange} checked={state.concluded} />
            </div>

            <div className="form-fiels">
              <label htmlFor="unsure">Unsure: </label>
              <input type="checkbox" name="unsure" onChange={handleChange} checked={state.unsure} />
            </div>
          </div>
           <button type="Submit" disabled={isSaving} onClick={saveLabelInfo}>{isSaving ? 'Saving...' : 'Save'}</button>
          <div className="label_image">
            <img src={`${process.env.REACT_APP_S3_URL}/${selectedLabel}`} alt="selectedLabel"/>
          </div>
        </div>) : <p style={{textAlign: 'center'}}>Select a file to label</p>}
      </div>
    </div>
  )
}
