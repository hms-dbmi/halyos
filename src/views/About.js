import React from 'react';
import './About.css';

const About = () => (
  <div className="about-us-container">
    <h1 className="about-heading">Halyos: A patient-facing visual EHR interface for longitudinal risk awareness</h1>
    <p className="dev-names">Developed By: Vimig Socrates, Samson Mataraso, Fritz Lekschas, and Nils Gehlenborg</p>
    <p className="affiliation"><a href="http://gehlenborglab.org/">Gehlenborg Lab at Harvard Medical School</a></p>

    <h3 className="description">What is Halyos?</h3>
    <p>Halyos <a href="halyos.gehlenborglab.org">(halyos.gehlenborglab.org)</a>, is a visual EHR web app that complements the functionality of existing patient portals. Halyos is designed to integrate with existing EHR systems to help patients interpret their health data. A link to the code is available on <a href="https://github.com/hms-dbmi/fhir-ignite/">Github</a>.</p>

    <h3 className="description">How does Halyos work?</h3>
    <p>The Halyos application utilizes the <a href="https://smarthealthit.org/">SMART on FHIR</a> platform to create an interoperable interface that provides <b>interactive visualizations of clinically validated risk scores</b> and longitudinal data derived from a patient’s clinical measurements. These visualizations allow patients to investigate the relationships between key clinical measurements and risk over time. By allowing patients to set hypothetical future values for these clinical measurements, patients can see how changes in their health will impact their risks. Using Halyos, patients are provided with the opportunity to actively improve their health based on increased understanding of longitudinal information available in EHRs and to begin a dialogue with their healthcare providers.</p>

    <h3 className="description">Acknowledgements</h3>
    <p>First off, thanks to everyone that helped out with brainstorming, design, and technical issues! Specifically, we'd like to thank the members of the Gehlenborg Lab, as well as Dr. Susanne Churchill, for their mentorship and support.</p>
      <div>Phoenix Favicon by Design Rails from the Noun Project</div>
      <div>Graph icon by Mister Pixel from the Noun Project</div>
      <div>Calendar by Adrien Coquet from the Noun Project</div>
      <div>Map Marker by Antonio Vicién Faure from the Noun Project</div>
      <div>User by TukTuk Design from the Noun Project</div>
      <div>Right by Aybige from the Noun Project</div>
      <div>Syringe by lastspark from the Noun Project</div>
      <div>Air by Setyo Ari Wibowo from the Noun Project</div>
      <div>Flower by Magicon from the Noun Project</div>
    <br/>

    <h4 className="disclaimer">The Nitty Gritty (Disclaimer)</h4>
    <p className="disclaimer-text">All content found on the Halyos Website, including: text, images, audio, or other formats were created for informational purposes only. The Content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read on this Website. If you think you may have a medical emergency, call your doctor, go to the emergency department, or call 911 immediately. We do not recommend or endorse any specific tests, physicians, products, procedures, opinions, or other information that may be mentioned on this site. Reliance on any information provided by this site is solely at your own risk. Links to external content are taken at your own risk. We are not responsible for the claims of external websites and education companies.</p>
  </div>
);

export default About;
