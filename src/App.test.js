import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { BrowserRouter} from 'react-router-dom';

import Main from './Main.js'
import Header from './Header.js'

import { getURL, getPatID }  from './utils/smart_setup.js'

import { shallow } from 'enzyme';

// const jsdom = require('jsdom')
// const JSDOM = jsdom;

// const options = {
// 	runScripts: "dangerously" ,
// 	resources:"usable"
// };

// console.log("type", typeof(JSDOM.fromFile));
// global.document = JSDOM.fromFile("../public/index.html", options).then(dom => {
// 	console.log(dom.serialize());
// })
// 	//('<body><script src="../public/js/fhir/fhir-client.js"></script></body>',{ runScripts: "dangerously" , resources:"usable"});
// global.window = document.defaultView;
// global.navigator = window.navigator;

//  const FHIR = global.window.FHIR;

// //console.log("FHIR", global.window);
// const FHIR_Client = FHIR.client({
//   serviceUrl: getURL(),
//   auth: {
//         type: 'none'
//   }

// });

// const Context_FHIR_Client = FHIR.client({
//   serviceUrl: getURL(),
//   patientId: getPatID(),

// });

const App = () => (
    <div>
    	<h1>Test</h1>
     {/*} <Header api={FHIR_Client.api} ptapi={Context_FHIR_Client.api} />
      <Main api={FHIR_Client.api} ptapi={Context_FHIR_Client.api} /> */}
    </div>
)

it('renders without crashing', () => {
  shallow(<App />);
});


// it('renders without crashing', () => {
//   const div = document.getElementById('root');
//   ReactDOM.render(
  	
//   	    shallow(<App />);
    
//   	), div);
// });
