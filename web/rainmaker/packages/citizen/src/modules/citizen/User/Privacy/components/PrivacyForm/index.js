import React from "react";
import { Link } from "react-router-dom";
import Field from "egov-ui-kit/utils/field";
//import Icon from "@material-ui/core/Icon";
import { Button, Card, Image,Icon , DropDown} from "components";
import IconButton from "material-ui/IconButton";
import Label from "egov-ui-kit/utils/translationNode";
import { CityPicker } from "modules/common";
import Hidden from "@material-ui/core/Hidden";
import { startSMSRecevier } from "egov-ui-kit/utils/commons";
import logo from "egov-ui-kit/assets/images/logo_black.png";
import qrlogo from "egov-ui-kit/assets/images//qrImage.png";
import "./index.css";

const iconButtonStyle = {
  paddingLeft: 0,
  paddingRight: 0,
  width: 35,
};
const style = {
  baseStyle: {
    background: "#ffffff",
    height: "30px",
  //  marginRight: "30px",
    width: "98px",
    marginBottom: "10px",
  },
  label: {
    color: "#5F5C57",
    fontSize: "12px",
    paddingRight: "40px",
    top : "-27px"
  },
  iconStyle: {
    top : "-24px",
    fill : "black"
  },
  listStyle: {
    display: "block",
  },
}


const PrivacyForm = ({  form}) => {
  const fields = form.fields || {};
  const submit = form.submit;
  return (
    <div className="rainmaker-displayInline"
    
    >
   <Card
  
  //  className="col-sm-offset-8 col-sm-8 user-screens-card"
   textChildren={
    <div style={{
      overflow: "scroll",
      height:"144rem",
      paddingRight:"10px"
    }}>
      <p><strong>Disclaimer &amp; privacy policy for the &ldquo;I&rsquo;m Chandigarh&rdquo; Application</strong></p>
	  <hr/>
<p>This privacy policy (&ldquo;<strong>Privacy Policy</strong>&rdquo;), describes and determines how we,&nbsp;<strong>Chandigarh Smart City Limited (CSCL) &amp; Municipal Corporation of Chandigarh (</strong><strong>MCC) &nbsp;(&ldquo;We&rdquo; or &ldquo;Us&rdquo; or &ldquo;Our&rdquo; or &ldquo;MCC &amp; CSCL&rdquo;)</strong>, handle and/ or deal in your (&ldquo;<strong>You/ your</strong>&rdquo;) personal information and sensitive personal information, as defined under the applicable laws of India (hereinafter collectively referred to as &ldquo;<strong>Personal Information</strong>&rdquo;).</p>
<p>This Privacy Policy shall be applicable and is effective as of 1<sup>ST</sup> June 2020. This Privacy Policy&nbsp;<em>inter alia</em>&nbsp;determines, how we control the Personal Information provided by You to Us, how We handle and deal in the Personal Information, correction of inaccuracies in the Personal Information provided by You to Us, the purposes for which the Personal Information provided by You may be used by Us.</p>
<p>This Privacy Policy should be read in conjunction with the Terms of Use available and can be read at the links- <a href="https://dev1.chandigarhsmartcity.in/web/guest/privacy-policy">https://dev1.chandigarhsmartcity.in/web/guest/privacy-policy</a> &amp; <a href="https://egov.chandigarhsmartcity.in/citizen/user/privacy">https://egov.chandigarhsmartcity.in/citizen/user/privacy</a> privacy policy. This Privacy Policy and the Terms of Use will govern the use and access of the web portal and mobile application entitled &lsquo;I&rsquo;m CHANDIAGRH&rsquo; [<a href="https://www.chandigarhsmartcity.in/">https://www.chandigarhsmartcity.in/</a> &amp; <a href="https://egov.chandigarhsmartcity.in/citizen">https://egov.chandigarhsmartcity.in/citizen</a>] (&ldquo;<strong>Portals</strong>&rdquo;) by you.</p>
<p>We collect, receive, possess, or store the Personal Information, to enable the Portal to function more effectively, and to enable us to provide more efficient services to you. If the terms of this Privacy Policy are not acceptable to you, please do not use the Portal and/ or the services provided by us. If you refuse to accept the terms of this Privacy Policy, We may choose not to offer you the services for which the Personal Information was being collected.</p>
<hr/>
<ul>
<li><strong> Collection</strong></li>
</ul>
<hr/>
<p>(a) We collect the following categories of Personal Information from you when you visit the Portal:</p>
<ul>
<li>(I) Your account username and password;</li>
<li>(ii) Your mobile phone number;</li>
<li>(iii) Your e-mail id;</li>
<li>(iv) Your personal contact details such as phone number and address;</li>
<li>(v) Your browser history and settings;</li>
<li>(vi) The type of browser that You use;</li>
<li>(vii) Statistics on page views;</li>
<li>(viii) IP information and standard web log information;</li>
<li>(ix) Any information which either individually or in combination with other information can be used to identify You;</li>
<li>(x) Any other details/information relating to any of the above mentioned categories;</li>
<li>(xi) Any other information that may be required by us for allowing You to access the Portal/ mobile application and for availing the services offered on the Portal/ Mobile application;</li>
<li>(xii) Full name.</li>
</ul>
<p>(b) The following will not qualify as Personal Information for the purposes of this Privacy Policy - information/ data, which is anonymous or which due to other factors, is incapable of identifying You either individually or in combination with other information;</p>
<p>(c) You agree that we are not responsible for the accuracy, authenticity or verification of the Personal Information provided by you.</p>
<hr/>
<ul>
<li><strong> Consent</strong></li>
</ul>
<hr/>
<p>(a) You hereby consent to the collection, storage, use, disclosure, and transfer, of the Personal Information by Us for the purposes detailed in this Privacy Policy. You hereby acknowledge and agree that collection, storage, use, disclosure, and transfer, by Us of the Personal Information is for a lawful purpose and does not violate the provisions of any law for the time being in force and is necessary for providing services to You on the Portal even in the future;</p>
<hr/>
<ul>
<li><strong> Storage</strong></li>
</ul>
<hr/>
<p>(a) You acknowledge and agree that the Personal Information collected by us, shall be stored by us in <strong>MCC &amp; CSCL&rsquo;s</strong> servers located at the State Data Centre (&ldquo;Server(s)&rdquo;). By using our Portal and providing Personal Information to Us, You are consenting to the storage of the same by Us at Our Server(s).</p>
<hr/>
<ul>
<li><strong> Use</strong></li>
</ul>
<hr/>
<p>The Personal Information collected by Us is used by Us, our affiliates, subsidiaries and joint ventures, inter alia, for -</p>
<ul>
<li>(i) Confirming Your registration details;</li>
<li>(ii) Allowing You to use the Portal and managing Your user account on the Portal;</li>
<li>(iii) Providing services to You, facilitating services provided by advertisers, third party service providers, and service partners;</li>
<li>(iv) Providing You with further information regarding Our services;</li>
<li>(v) Sending promotional features/ materials to You regarding the Portal, and other third party promotional material/ advertisements;</li>
<li>(vi) Enhancing the efficiency/ quality of Our services;</li>
<li>(vii) Resolving any disputes that may arise with respect to the transactions/ deals that You may conduct using the Portal/ Our services;</li>
<li>(viii) Monitoring Your activity and preferences as evidenced from Your activity on the Portal;</li>
<li>(ix) Detecting, investigating and preventing activities that may violate our policies or that may be illegal or unlawful;</li>
<li>(x) Conduct research or analyze the user preference, demographics;</li>
<li>(xi) Any other purposes required for offering the services on the Portal;</li>
<li>(xii) Any purposes as may be required under applicable laws.</li>
</ul>
<p>You agree that we may use personal information about you to improve services of CSCL &amp; MCC, marketing and promotional efforts, to analyze Portal usage, improve the Portal's content and service offerings, and customize the Portal's content, layout, and services. These uses improve the Portal to, inter alia, meet your needs, so as to provide you with a smooth, efficient, safe and customized experience while using the Portal.</p>
<p>We do not sell or rent your personal information to third parties for their marketing purposes without your explicit consent and we only use your information as described in the Privacy Policy.</p>
<hr/>
<ul>
<li><strong> Disclosure</strong></li>
</ul>
<hr/>
<p>(a) We acknowledge that the Personal Information provided by You is important and confidential, and the contents of such Personal Information shall not be disclosed by Us to any Person, except to such third parties as are specified in this Privacy Policy. For the purposes of this Privacy Policy, the term &ldquo;Person&rdquo; shall mean and connote any individual, corporation, partnership, limited liability partnership, joint venture, body corporate or other organization, association or entity;</p>
<p>(b) The Personal Information provided by You can be shared by Us at any time without obtaining explicit consent from You, with any government agencies mandated under the law to obtain Personal Information including sensitive Personal Information for the purpose of verification of identity, or for prevention, detection, investigation including cyber incidents, prosecution, and punishment of offences;</p>
<p>(c) Personal Information provided by You may also be disclosed by Us at any time without obtaining explicit consent from You to comply with subpoena or similar legal process or &nbsp;to any third party by an order under the applicable law for the time being in force;</p>
<p>(d) The Personal Information provided by you may also be disclosed if necessary to protect our rights, protect your safety or the safety of others, investigate fraud, or to respond to any government request;</p>
<p>(d) We will make endeavor&rsquo;s to ensure that third parties who are the recipients of the Personal Information maintain the confidentiality of such information, with the same level of data security practices as are employed by Us in relation to the Personal Information, and use the Personal Information only in relation to the Portal and the services offered by Us to You;</p>
<p>(e) We may also disclose the Personal Information to enforce our policies, and/ or to address concerns/ complaints, and/ or to prevent any unethical/ illegal practices/ activity.</p>
<hr/>
<ul>
<li><strong> Recipients</strong></li>
</ul>
<hr/>
<p>(a) Personal Information may be disclosed/ transferred to the following recipients:</p>
<ul>
<li>(i) Third party service providers who assist Us in rendering services to You and/ or enhance the efficiency of the services to You;</li>
<li>(ii) Third party service providers who require Your information only in connection with the services offered on the Portal, for monitoring Your preferences, for displaying personalized advertisements to You, for displaying important communications regarding the services to You;</li>
<li>(iii) Our affiliates, other users of the Portal and service partners strictly for the purposes specified in paragraph 4 above.</li>
</ul>
<hr/>
<ul>
<li><strong> Cookies</strong></li>
</ul>
<hr/>
<p>(a) We may use cookies and other web beacons for the following purposes:</p>
<ul>
<li>(i) Identifying and assessing consumer preferences and managing user sessions;</li>
<li>(ii) In order to provide You with basic features on the Portal;</li>
<li>(iii) To enable Us to identify Your device and help You navigate the Portal;</li>
<li>(iv) Other information such as Your browsing history;</li>
<li>(v) To enable Us to enhance the quality of services provided by Us to You;</li>
<li>(vi) To enable Us to enhance the quality of functioning of the Portal and provide an enhanced user experience to You;</li>
<li>(vii) To enable third party service providers to display personalized advertisements/ content/ messages to You; and</li>
<li>(viii) To collect standard information such as Your IP address, computer sign-on data, statistics on page views.</li>
</ul>
<p>(b) You may refuse the use of cookies on your computer/mobile and adjust the settings of your browser to disable cookies. You may also at any time disable/ delete cookies which are already activated on your computer. However, please note that should you choose to disable cookies from operating on your computer, certain sections/ features of the Portal may become inaccessible to you.</p>
<hr/>
<ul>
<li><strong> Other Information</strong></li>
</ul>
<hr/>
<p>(a) We may provide You links to other third-party websites for your convenience and information, and to enable You to access and avail the services requested by You. In the event that You choose to visit/ access such third party websites and/ or avail such services on offer by the aforementioned third party service providers, the privacy policy/ terms of use of such third party websites shall be applicable to You, and we shall not at any time be responsible and/ or liable for any content/ information provided/ intimated to You on such third party websites.</p>
<p>(b) Any personal and/ or sensitive personal information including your contact details, bank account details, credit card account details, collected by such third party websites, shall be subject to the terms of the privacy policy provided by such third party websites, and you acknowledge that our privacy policy shall not be applicable to the same. Moreover, <strong>MCC &amp; CSCL&rsquo;s </strong>shall not at any time be responsible/ liable/ accountable for any personal and/ or sensitive personal information that you provide to and/ or is collected by such third party websites.</p>
<p>(c) <strong>MCC &amp; CSCL&rsquo;s</strong> may from time to time send you certain promotional material/ advertisements/ additional information with regard to the services provided/ offered by us, to the e-mail address provided by you. You may at any time choose to opt-out of receiving such communications, by sending an e-mail to this effect to the contact address provided under paragraph 14 below.</p>

<hr/>
<ul>
<li><strong> Security</strong></li>
</ul>
<hr/>

<p>Please be aware that, although We endeavor provide reasonable security for Your Personal Information &nbsp;We process and maintain, no security system can prevent all potential security breaches. However, We employ commercially reasonably data security practices and procedures commensurate with the specifications under the applicable laws, including encryption, passwords, physical security and other technical, physical and administrative, mechanisms and measures, to protect/ safeguard the security and integrity of Your Personal Information.</p>
<p>In view of the functionality of the internet and provision of services over the internet, We cannot guarantee the complete security of Your Personal Information at any time. Given that the internet is a medium which is prone to several security hazards and other events/ incidents which are beyond Our control, while we will strive to ensure full protection to Your Personal Information, We cannot guarantee the same at any given time. Any Personal Information provided by You, must therefore be provided with full cognizance of this risk. &nbsp;</p>

<hr/>
<ul>
<li><strong> Publically available information</strong></li>
</ul>
<hr/>
<p>Personal Information contained in publically available postings by you on the Portal, if any, shall be Your sole responsibility. While the terms of this Privacy Policy shall be applicable to all features/ sections of the Portal, You hereby agree and acknowledge that by including Personal Information in postings available for view/ display to all users of the Portal, You have waived any confidentiality of such information.</p>
<hr/>
<ul>
<li><strong> Spam</strong></li>
</ul>
<hr/>
<p>You shall not at any time be entitled to use the Personal Information of other Portal users that You may have gained access to, for the purpose of spamming/ phishing the account of such user and/ or persisting in sending communications to such user without their consent.</p>

<hr/>
<ul>
<li><strong> Disclaimer</strong></li></ul><hr/>

<ul>
<li>Your access/use and reliance upon any/all information/s, Matters contained/ shown or Facilities/Services offered by &ldquo;I&rsquo;m Chandigarh&rdquo; through its website/mobile application is entirely at your own risk.</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>You may download material displayed on the Site subject to copyright and other proprietary ownership of the information retained with <strong>MCC &amp; CSCL</strong>. You may not, however, distribute, modify, transmit, reuse, report, or use the contents of the Site for public or commercial purposes, including the text, images, audio, and video without written permission of <strong>MCC &amp; CSCL</strong>.</li>
</ul>
<p>&nbsp;</p>
<p>&nbsp;</p>
<ul>
<li><strong>MCC &amp; CSCL</strong> reserves the rights to modify and/or change anything (including technical / non-technical and general information/s, any kind of data, statistics, styling or mode of presentation/operation, or any content therein on this website/mobile application at any point of time, without prior notice or reason whatsoever.</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>All information/Data contained herein is to be used for reference and as guidelines only and are based on record/information available with the <strong>MCC &amp; CSCL</strong>. All possible care has been taken to verify the accuracy/correctness of the information/data, neither <strong>MCC &amp; CSCL</strong>, nor its Officer, vendors, assume any kind of responsibility for the accuracy/correctness or for any loss arising out of any information contained herein <strong>MCC &amp; CSCL</strong> is in no way responsible for any claim/s arising out of the use / quote of any information/data displayed/shown on the website/mobile application. The information/data contained herein should not be construed as a statement of law or used for any legal purposes. Any action you take upon the information/data available herein is strictly at your own risk and <strong>MCC &amp; CSCL</strong> will not be liable for any expense, losses and damages including, indirect and consequential loss or damages whatsoever arising from or in connection with the use of such information/data.</li>
</ul>
<p>&nbsp;</p>
<ul>
<li>All the services available on I&rsquo;m Chandigarh platform have been integrated online with other back-end systems. Hence, the availability of these services is dependent upon the back-end system. In case any service is temporarily not available, <strong>MCC &amp; CSCL</strong> will not be responsible for the same. However, the support team shall act on resolving the issues at the earliest.</li>
<li><strong> Updates to Privacy Policy</strong></li>
</ul>
<p>We may update/ modify this Privacy Policy from time to time for any reason. You are advised to consult this Privacy Policy regularly for any changes and Your continued use of the services and the Portal shall be deemed acceptance of the updated/ modified Privacy Policy by You.</p>

<hr/>
<ul>
<li><strong> Support Helpdesk</strong></li>
</ul>
<hr/>
<p>For any grievance/information/suggestion please write to us at <a href="mailto:egov.chd.helpdesk@gmail.com">egov.chd.helpdesk@gmail.com</a> or the users from India can contact us on our 24x7 free helpline- +91 172 2787200</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
      </div>
   }
   />
    </div>
  );
};

export default PrivacyForm;
