# Halyos  [![Build Status](https://travis-ci.org/hms-dbmi/halyos.svg?branch=master)](https://travis-ci.org/hms-dbmi/halyos)
##### Redesigning the Patient Portal Experience with SMART on FHIR

---

Halyos is a visual EHR web app developed at the Harvard Medical School by the [Gehlenborg Lab](http://gehlenborglab.org/) that complements the functionality of existing patient portals. Halyos is designed to integrate with existing EHR systems to help patients interpret their health data.

The Halyos application utilizes the SMART on FHIR platform to create an interoperable interface that provides interactive visualizations of clinically validated risk scores and longitudinal data derived from a patient’s clinical measurements.

**Demo:** http://halyos.gehlenborglab.org/

**Wiki:** https://github.com/hms-dbmi/halyos/wiki (In progress)

## Development

#### Dependencies

```bash
npm install
```

#### Commands

```JavaScript
npm start      // Start dev server at http://localhost:3000
npm run build  // Build application
npm run test   // Test application
```

## Built With

* [React.js](https://reactjs.org/) - Web framework
* [Redux.js](https://redux.js.org/) - JS state management
* [SMART on FHIR](https://smarthealthit.org/) - App platform and FHIR JS client
* [fhir.js](https://github.com/FHIR/fhir.js) - FHIR JS client
* [d3.js](http://d3js.org/) - Graph visualization framework


## Authors

* **Samson Mataraso** - Research Intern
* **Vimig Socrates** - Research Intern
* **Fritz Lekschas** - [SEAS](https://www.seas.harvard.edu/) PhD Candidate
* **Nils Gehlenborg** - Principal Investigator

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Members of Harvard DBMI for brainstorming, design and feedback
* Dr. Susanne Churchill for her mentorship and support
* Summer Institute in Biomedical Informatics at DBMI for the opportunity
