/*
	Imports:
	1. data : the dataset inside the .json file.
	2. useRef : management of the references within both headers and table content.
*/
import data from './data.json';
import React, {useRef} from "react";

/*
	Provides the dataset imported from the data.json file. 
  + Output : Array of objects containing the .json file information, each
           register contains a row of the deployed table.
*/
function getData() {
  return data;
}

/*
	Loads the element containing all the table module.
*/
function App() {
  /*
    Initializes the dataset references:
    + headersRef : Table headers reference.
    + rowsRef : Table content reference.
  */ 
  const headersRef = useRef([]); 
  headersRef.current = []; 
  const rowsRef = useRef([]);
  rowsRef.current = [];

  /*
    Initialize the information regarding both
    the dataset in the view and logic.
  */ 
  var dataSet = getData();
  var informationTable = [];
  var infoRow = []; 

  dataSet.map((data) => {
    infoRow.push(data.region_name);
    infoRow.push(data.region_alpha_code);
    infoRow.push(data.value);
    infoRow.push(data.ref_date);
    informationTable.push(infoRow);
    infoRow = []; 
  });
 
  /*
    References regarding the column re-ordering interaction:
    + isReorderActive : Sets the columns reorder lifecycle.
    + infoOrigin : Origin column information.
    + posOrigin : Origin column position.
    + infoDestiny : Destiny column information.
    + posDestiny : Destiny column position.
  */
  var isReorderActive = false;
  var infoOrigin = [];
  var posOrigin; 
  var infoDestiny = [];
  var posDestiny;

  const HEADERSTEXT = ["Region name",
                       "Region alpha code",
                       "Value",
                       "Reference date"];

  /*
    Captures the dataset references whenever
    the events are called
  */
  const addHeaderToRefs = (el) =>{
    if(el!=null){
      headersRef.current.push(el);
    }
  };
  const addRowToRefs = (el) =>{
    if(el!=null){
      rowsRef.current.push(el);
    }
  };
    
  /*
    Renders the headers, including:
    + Interactions.
    + References.
    + Visual elements.
  */
  const renderHeaders = () => {
    var headers = [];
    HEADERSTEXT.map((header,i) => {
                     // Adds the current element to the headers reference
        headers.push(<th ref={addHeaderToRefs}>
                     <input type="text"  
                        //Adds both key and click handler (explanation further in this document)
                        onKeyPress={event => keypressHandler(event,i)} 
                        defaultValue={header}/>   
                     <a href="#" onClick={event => handleReorderColumns(i)}>
                         <i className="fa">&#xf021;</i></a> 
                     </th>);
        return headers; 
    }); 
    return headers;
  }

  /*
    Whenever the Enter button is pressed, removes the focus
    of the element, in order to finish the column rename interaction. 
  */
  const keypressHandler = (event,currentPos) => {
    if (event.key === "Enter") {
        headersRef.current[currentPos].childNodes[0].blur();
    }
  };

  /*
    Handles the columns reorder according to its lifecycle current state.
  */
  const handleReorderColumns = (selectedPos) => {
    /*
      The reorder follows this path:
      1. Saves the columns position.
      2. Reorder the columns (if the method is invoqued).
      3. Styles the involved columns.
      4. Updates the reorder lifecycle.
    */
    if(isReorderActive){
      posDestiny = selectedPos;
      reOrderColumns(posOrigin,posDestiny);
      restoreSelectedStyle(posOrigin);
      isReorderActive = false; 
    }else{
      posOrigin = selectedPos;
      changeSelectedStyle(selectedPos);
      isReorderActive = true; 
    }
  }

  /*
    Reorders the selected columns.
  */
  function reOrderColumns(posOrigin,posDestiny){
    //Captures the columns' inner data
    infoOrigin = getColumnInformation(posOrigin);
    infoDestiny = getColumnInformation(posDestiny);
    //Switches the columns' data
    for(var i = 0; i < informationTable.length; i++){
      rowsRef.current[i].cells[posOrigin].innerText = infoDestiny[i];
      rowsRef.current[i].cells[posDestiny].innerText = infoOrigin[i];
      informationTable[i][posOrigin] = infoDestiny[i];
      informationTable[i][posDestiny] = infoOrigin[i];
    }
    //Switches the headers text
    const headerOrigin = headersRef.current[posOrigin].childNodes[0].value;
    const headerDestiny = headersRef.current[posDestiny].childNodes[0].value;
    headersRef.current[posOrigin].childNodes[0].value = headerDestiny;
    headersRef.current[posDestiny].childNodes[0].value = headerOrigin;
  };

  /*
    Styles the column regarding the reordering current state.
  */
  function changeSelectedStyle(selectedPos){
    headersRef.current[selectedPos].style.boxShadow = "-2px -2px 7px -1px #888888";
    headersRef.current[selectedPos].style.filter = "brightness(190%)";

    for(var i = 0; i < headersRef.current.length; i++){
      if(i!==selectedPos){
        headersRef.current[i].childNodes[1].style.filter = "brightness(190%)";
        headersRef.current[i].childNodes[1].childNodes[0].style.fontSize = "130%";
      }
    }
  }
  function restoreSelectedStyle(selectedPos){
    headersRef.current[selectedPos].style.boxShadow = "none";
    headersRef.current[selectedPos].style.filter = "brightness(100%)";

    for(var i = 0; i < headersRef.current.length; i++){
      if(i!==selectedPos){
        headersRef.current[i].childNodes[1].style.filter = "brightness(100%)";
        headersRef.current[i].childNodes[1].childNodes[0].style.fontSize = "100%";
      }
    }
  }

  /*
    Returns the column data according to the given position.
  */
  function getColumnInformation(selectedPos){
    var selectedInformation = [];
    for(var i = 0; i < informationTable.length; i++){
      selectedInformation.push(informationTable[i][selectedPos]);
    }
    return selectedInformation;
  };

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
              {renderHeaders()}
          </tr>
        </thead>
        <tbody>
          { dataSet.map((data, i) => {
            return (
                <tr ref={addRowToRefs}>
                <td>{data.region_name}</td>
                <td>{data.region_alpha_code}</td>
                <td>{data.value}</td>
                <td>{data.ref_date}</td>
                </tr>
            )
          })}
        </tbody>
      </table>  
    </div>
  );
}

export default App;
