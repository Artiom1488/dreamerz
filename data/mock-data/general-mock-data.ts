export const getNavItems = (gender?: string | null, role?: string | null) => {
  const getPossessivePronoun = () => {
    if (!gender) return "Her";
    return gender === "MALE" ? "His" : "Her";
  };

  const getObjectPronoun = () => {
    if (!gender) return "Her";
    return gender === "MALE" ? "Him" : "Her";
  };

  // Dream Angel has different navigation items
  if (role === "ANGEL") {
    return [
      { id: "activity", label: "Activity" },
      { id: "about", label: "About Me" },
      { id: "fulfilled", label: "Fulfilled" },
    ];
  }

  // Regular Dreamer navigation
  return [
    { id: "dream", label: `${getPossessivePronoun()} Dream` },
    { id: "activity", label: "Activity" },
    { id: "about", label: `About ${getObjectPronoun()}` },
    { id: "fulfilled", label: "Fulfilled" },
    { id: "received", label: "Received" },
  ];
};

export type ContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "bullets"; items: string[] };

export type PrivacySection = {
  id: string;
  title: string;
  content: ContentBlock[];
};

export const privacySections: PrivacySection[] = [
  {
    id: "welcome",
    title: "Welcome to Dreamerz!",
    content: [
      {
        type: "paragraph",
        content:
          "Dreamerz is a social platform where every user can realize it's own dream and help others fulfill their dreams by interacting with other Dreamerz and Dream Angels sharing one $tar (dollar) for a dream. This updated Privacy Policy applies to Dreamerz, Dream Angels, Wing Donations and all users of our platform, and is part of our Terms of Use.",
      },
      {
        type: "paragraph",
        content:
          "Dreamerz is a global company. By using our platform, you agree that your personal information that you provide directly to us, or that we collect through your use of the platform, may be transferred to and stored in the United States and handled as described in this Policy.",
      },
    ],
  },
  {
    id: "information-provided",
    title: "Information You Provide Through Your Account",
    content: [
      {
        type: "paragraph",
        content:
          "This is information that you provide to us through text fields, such as your name, payment information and benefits. The information we collect is the same if you make an account, become a Dreamer, or become a Dream Angel:",
      },
      {
        type: "bullets",
        items: [
          "First Name",
          "Last Name",
          "Birth date",
          "Email Address",
          "Phone number",
          "Password",
          "State and Country of Residence",
          "City",
        ],
      },
    ],
  },
  {
    id: "dreamer",
    title: "Dreamer",
    content: [
      {
        type: "paragraph",
        content:
          "A Dreamer is a person who has its own dream mentioned and described clearly on the platform, that has already subscribed with one of the three packages and started to fulfill other dreams with sharing only one star (dollar) for the dream.",
      },
      {
        type: "paragraph",
        content:
          "All the dreams that you will fulfill will be collected on your profile and you will have the option to double your own dream amount. The more you give, the more you receive.",
      },
      {
        type: "paragraph",
        content:
          "As a Dreamer you must provide your payment information to our payment processors. You can see the privacy policy for these payment processors on the Stripe site. Payment processors provide us with a token that represents your account, your card's expiration date, card type and the last four digits of your card number.",
      },
      {
        type: "paragraph",
        content:
          "If you are required to provide your name and email address to the payment processor, then they also provide us with that information. We collect and process information about the users that fulfilled your dream, the dreams you have fulfilled and wings donations that you support. We may also require your bank account information to process payouts.",
      },
    ],
  },
  {
    id: "dream-angel",
    title: "Dream Angel",
    content: [
      {
        type: "paragraph",
        content:
          "A Dream Angel is a person who doesnt have it's own dream. To become a Dream Angel you just have to subscribe with one of the three packages and start to fulfill other dreams with sharing only one star (dollar) for the dream.",
      },
      {
        type: "paragraph",
        content:
          "All the dreams that you fulfilled will be collected on your profile. As a Dream Angel you must provide your payment information to our payment processors. You can see the privacy policy for these payment processors on the Stripe site.",
      },
      {
        type: "paragraph",
        content:
          "We collect and process information about the users that dreams you have fulfilled and wings donations that you support.",
      },
    ],
  },
  {
    id: "wings-donations",
    title: "Wings Donations",
    content: [
      {
        type: "paragraph",
        content:
          "Wings Donations are campaignes organized by Dreamerz with the aim of cases from all over the world. Wings Donations are not collecteble for Dreamerz and Dream Angels, so the donations will be maid without anny expectaitions.",
      },
      {
        type: "paragraph",
        content:
          "Our payment processors collect your credit card details and other information necessary to process the donation such as your home address. You can see the privacy policy for these payment processors on the Stripe site.",
      },
    ],
  },
  {
    id: "additional-information",
    title: "Additional Information We Collect",
    content: [
      {
        type: "paragraph",
        content:
          "Automatically Collected Information: We collect information automatically as you navigate the site or through our third party analytics providers. We may store usage information such as the type of device you use to access Dreamerz, your operating system, browser type, IP address, and device ID, the pages you visit or request, links clicked, referring sites, user interactions and your search terms.",
      },
      {
        type: "paragraph",
        content:
          "We also derive your location from your self-disclosed country, your IP address, and from your payment card.",
      },
      {
        type: "paragraph",
        content:
          "Comments: We keep track of how many times users come, what they do on the site, where they respond, who they connect with, their IP address, and where they checked in.",
      },
    ],
  },
  {
    id: "third-party-information",
    title: "Information Collected by Third Parties",
    content: [
      {
        type: "paragraph",
        content:
          "Cookies: We use Cookies on our website that collect information to allow us and third parties to understand your use of Dreamerz. Cookies are not strictly necessary for the website to work, but it will provide you with a better browsing experience. If you choose to delete or block these cookies, some features of this site may not work as intended.",
      },
      {
        type: "paragraph",
        content:
          "Cookies are small pieces of information that are issued to your computer or mobile device when you visit a website, or access or use a mobile application. That information regarding your use of the Platform is stored and sometimes tracked. We use cookies or other electronic technologies (such as pixel tags) for various purposes. Unlike Cookies, pixel tags are embedded in web pages. Pixel tags are tiny graphic images with unique identifiers that track online movements of our users.",
      },
    ],
  },
  {
    id: "analytics",
    title: "Analytics",
    content: [
      {
        type: "paragraph",
        content:
          "We use third-party web analytics services on our Services, such as those of Google Analytics, to help us analyze how users use the Services, including by noting the third-party website from which you arrive, and providing certain features to you including Google Signal features such as user id tracking, dynamic remarketing, interest-based advertising, audience targeting, behavioral reporting, demographics and interests reporting, user segment analysis, device reporting, display advertising, and video ads reporting.",
      },
      {
        type: "paragraph",
        content:
          "The information acquired by the technology (including an anonymized IP address) will be shared to or collected directly by these service providers, who will use it to assess your use of the Services. This information can be used to target adverts on the Platform depending on your interests. You may see adverts for our Platform on other websites as a result of this.",
      },
      {
        type: "paragraph",
        content:
          "Google's ability to use and share information collected by Google Analytics about your visits to the Site is restricted by the Google Analytics terms of use and the Google policy.",
      },
    ],
  },
  {
    id: "social-media",
    title: "Social Media Features and Widgets",
    content: [
      {
        type: "paragraph",
        content:
          "We use social networking elements like the Instagram and Facebook Like buttons, as well as widgets like the Share button and other interactive Dreamerz mini-programs. We may use your social media information to interact with you on these social networks if you offer it to us.",
      },
      {
        type: "paragraph",
        content:
          "These features may collect your IP address and other personal information, such as the page of our site you are visiting, and may set a cookie to enable the features to function efficiently. Social media features and widgets are hosted by a third party or by Dreamerz directly. The privacy policies of the companies that provide these features govern your interactions with them. Please see this page for further information on the technologies that these social networks employ.",
      },
    ],
  },
  {
    id: "why-cookies",
    title: "Why We Use Cookies",
    content: [
      {
        type: "paragraph",
        content:
          "We use Cookies to collect information about your access to and use of the Platform, including to:",
      },
      {
        type: "bullets",
        items: [
          "allow you to navigate and use all the features provided by our Platform",
          "customize elements of the layout and/or content within the Platform and remember that you have visited us before",
          "identify the number of unique visitors we receive",
          "improve the Platform and learn which functions of the Platform are most popular with users",
          "understand how you use the Platform (e.g., by learning how long you spend on the Platform and where you have come to the Platform from)",
        ],
      },
      {
        type: "paragraph",
        content:
          "As we adopt additional technologies, we may gather additional information through other methods. We will notify you of such changes with updates to this Policy.",
      },
    ],
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    content: [
      { type: "paragraph", content: "We process your information to:" },
      {
        type: "bullets",
        items: [
          "verify your identity to comply with US federal, state, and international laws",
          "allow you to sign in to your account",
          "allow you to fulfill peoples dreams",
          "allow you to donate for the Wings Donations campaignes",
          "process all the dreams and wings donations payments and payouts",
          "send you emails relevant to your usage, as controlled by your email preferences",
          "reply to your questions",
          "promote your Dreamerz account for greater discoverability",
          "understand how you use the service, and how to manage your dream",
          "prevent fraud and abuse on Dreamerz",
          "provide you with reasonable accommodation, if you notify us of a disability",
        ],
      },
    ],
  },
  {
    id: "share-with-dreamer",
    title: "Information We Share with a Dreamer or a Dream Angel",
    content: [
      {
        type: "paragraph",
        content:
          "By becoming a dreamer or a dream angel, you agree to have the following information shared:",
      },
      {
        type: "bullets",
        items: [
          "your name and email address, and other profile information you've provided",
          "any comments you send to dreamers or wings donations throught Dreamerz",
          "your city, and country",
          "your phone number if it would be mentioned",
          "all details about your dream or wings donations, such as the amount and start date, but not your credit card information",
          "some aggregated and anonymized data about how you use Dreamerz that cannot be linked back to you or to any individual user",
        ],
      },
    ],
  },
  {
    id: "share-with-third-parties",
    title: "Information We Share with Third Parties",
    content: [
      {
        type: "paragraph",
        content:
          "We never sell your information to third parties. We will only share data with third parties, under the following circumstances:",
      },
      {
        type: "bullets",
        items: [
          "With our service providers, which are companies that are contractually obligated to provide us with services like order fulfillment, email management, data analysis, credit card processing, multi-currency settlement solutions, increasing our brand awareness and user engagement with marketing initiatives, and fraud detection and prevention. These companies may need access to your data to provide their services, and they are required by contract to protect any of your data they receive from Dreamerz to the same level that Dreamerz does.",
          "to protect the security or integrity of Dreamerz, and to protect the rights, property, or safety of Dreamerz, its employees, users, or others, if we believe that disclosure is reasonably necessary to comply with a law, regulation, or other valid legal process (e.g., subpoenas or warrants served on Dreamerz). If we are going to release your data, we will do our best to provide you promptly with notice by email, unless we are prohibited by law from doing so.",
          "in connection with the sale, merger, bankruptcy, sale of assets or reorganization of our company. We will notify you if a different company receives your data. The promises in this privacy policy apply to any data transferred to a new entity.",
          "with third party apps used by creators to help run their membership programs.",
          "with partners who may have access to your data to perform their services, and who are obligated by contract to safeguard any of your data they receive from us to the same extent that Dreamerz protects it.",
        ],
      },
    ],
  },
  {
    id: "collect-from-third-party",
    title: "Information Dreamerz Collects from Third Party",
    content: [
      {
        type: "paragraph",
        content:
          "When you create a Dreamerz account, you can elect to connect your social account(s) (e.g. Facebook, Instagram, Google) with Dreamerz, and we will collect and store some social information from those platforms, such as:",
      },
      {
        type: "bullets",
        items: [
          "follower or subscriber counts",
          "post or upload counts",
          "view, like, and comment counts",
        ],
      },
      {
        type: "paragraph",
        content:
          "This social information allows us to provide you a better Dreamerz experience, and also helps guide future development of Dreamerz. We use this data to:",
      },
      {
        type: "bullets",
        items: [
          "help dreamers and dream angel find each other on Dreamerz",
          "assess how to make dreamers more successful on Dreamerz",
          "help wings donations become more famous and accessible",
          "analyze and describe our business",
        ],
      },
    ],
  },
  {
    id: "share-with-public",
    title: "Information We Share with the Public",
    content: [
      {
        type: "paragraph",
        content: "The following information is publicly accessible:",
      },
      {
        type: "bullets",
        items: [
          "your profile, and your social media links and location if you add that information",
          "by default the Dreamer or Wing Donation you support are publicly displayed",
          "any dream, or comments you make",
          "the amount for the dream that you expect",
          "number of fulfilled dreams",
          "number of recieving stars for your dream",
          "the number of the Wing Donations that you support",
        ],
      },
    ],
  },
  {
    id: "preferences-rights",
    title: "Your Preferences and Rights over Data",
    content: [
      {
        type: "paragraph",
        content:
          "Choosing Your Preferences: The Settings link is located by clicking on your avatar or profile at the top right hand of your screen, after your log into your Dreamerz account. Settings lets you see your account preferences. You can see and adjust your settings by viewing your preferences and, if you wish, by changing your selections.",
      },
    ],
  },
  {
    id: "marketing-activities",
    title: "Marketing Activities",
    content: [
      {
        type: "paragraph",
        content:
          "By agreeing to our terms of use, you expressly agree that Dreamerz may:",
      },
      {
        type: "bullets",
        items: [
          "provide you with information about your service, service enhancements, or new Dreamerz products, while you are on our web site.",
          "send you messages regarding your existing service, or enhancements related to your existing service, when you are off our platform, via email, or via text, if you have signed up for a service or event notification that uses text messages.",
          "market Dreamerz to you and audiences similar to you based on your networks and common factors that others have with you, unless you opt out.",
          "send you marketing emails or texts if you don't have a Dreamerz account but have consented to receiving such messages, from which you may opt out.",
          "promote your account for greater discoverability.",
        ],
      },
    ],
  },
  {
    id: "data-rights",
    title: "Exercising Your Data Rights",
    content: [
      {
        type: "paragraph",
        content:
          "Users in certain locations may have certain rights under the General Data Protection Regulation (GDPR) regarding data that Dreamerz controls as a Data Controller as defined under the GDPR, including:",
      },
      {
        type: "bullets",
        items: [
          "the right of access to their personal data",
          "the right to correct or rectify any inaccurate personal data",
          "the right to restrict or oppose the processing of personal data",
          "the right to erase or delete their personal data",
          "the right to personal data portability",
          "the right to opt-out of the sale of personal information",
        ],
      },
      {
        type: "paragraph",
        content:
          "You can exercise rights over your data on Dreamerz in the following ways:",
      },
      {
        type: "bullets",
        items: [
          "accessing, reviewing, modifying, and updating your data by logging into your account at Dreamerz and going to your account settings",
          "viewing our privacy policy or viewing our data practices by going online to our Dreamerz Privacy Center, where the Data Practices tab describes how we use our data, and the Policies tab shows you our privacy policy.",
          "deleting a previously-disabled account by emailing Dreamerz at privacy@dreamerz.net.",
          "going to FAQ online for data-related issues, or contact us by email.",
        ],
      },
      {
        type: "paragraph",
        content:
          "If you are unable to log into your account, and are unable to recover your account with a password reset in order to lodge your privacy request, then you may reach out to privacy@dreamerz.net. We reserve the right to decline you access to or recovery of your account, at our discretion, to prevent an unauthorized takeover of your account.",
      },
    ],
  },
  {
    id: "data-retention",
    title: "Our Data Retention Period",
    content: [
      {
        type: "paragraph",
        content:
          "We retain your account information for ten years after your account is last active, unless you delete, or you request us to delete, your account. We may continue to retain some information, even after you delete your account if we are required to do so in order to comply with various laws.",
      },
    ],
  },
  {
    id: "security",
    title: "Security",
    content: [
      {
        type: "paragraph",
        content:
          "While no organization can guarantee perfect security, Dreamerz has implemented and seeks to continuously improve technical and organizational security measures to protect the information provided via the Services from loss, misuse, unauthorized access, disclosure, alteration, or destruction. For example, limiting access to information only to employees and authorized service providers who need to know such information for the purposes described in this Policy.",
      },
    ],
  },
  {
    id: "cross-border",
    title: "Cross Border Data Transfers",
    content: [
      {
        type: "paragraph",
        content:
          "Dreamerz is a global organization headquartered in the United States, which processes your information in servers in a number of countries, including the United States. Dreamerz has implemented other appropriate cross-border transfer solutions, such as Standard Contractual Clauses approved by appropriate regulatory authorities, to provide adequate protection for transfers of certain personal data from the European Economic Area, United Kingdom and Switzerland to the United States.",
      },
    ],
  },
  {
    id: "outside-us",
    title: "Users from Outside the United States",
    content: [
      {
        type: "paragraph",
        content:
          "The Platform is hosted in the United States. If you are visiting the Platform from outside the United States, please be aware that your information may be transferred to, stored and processed in the United States where our servers are located and our central database is operated.",
      },
      {
        type: "paragraph",
        content:
          "The data protection and other laws of the United States and other countries might not be as comprehensive as those in your country. By using the Platform, you consent to your information being transferred to our facilities and to the facilities of those third parties with whom we share it as described in this Policy.",
      },
    ],
  },
  {
    id: "children",
    title: "Children",
    content: [
      {
        type: "paragraph",
        content:
          "Dreamerz is not directed at children under the age of 13 and 16 years in the EU, you may use Dreamerz, only with the approval of your parent or guardian, otherwise children may not create an account or use Dreamerz.",
      },
    ],
  },
  {
    id: "changes",
    title: "Changes",
    content: [
      {
        type: "paragraph",
        content:
          "We may sometimes make changes to this policy. If we make material changes that adversely affect your rights under this policy, we will let you know by posting an announcement on the site or sending you an email in advance of the changes coming into effect.",
      },
      {
        type: "paragraph",
        content:
          "Continuing to use Dreamerz after a change to this policy means you accept the new policy. If you have any questions, please email privacy@dreamerz.net.",
      },
    ],
  },
];

export const termsSections: PrivacySection[] = [
  {
    id: "welcome",
    title: "Welcome to Dreamerz!",
    content: [
      {
        type: "paragraph",
        content:
          'By using Dreamerz you agree to these terms. These are Dreamerz terms of use, and they apply to all users of the Dreamerz platform. "We," "our" or "us" refers to Dreamerz Group LLC. "Dreamerz" refers to this platform and the services offered by us. By using Dreamerz you agree to these terms and to the other policies we post. Please read them carefully and let us know if you have any questions. For information about our data practices, please see our Privacy Policy. We can collect and use your information in accordance with those policies.',
      },
    ],
  },
  {
    id: "your-account",
    title: "Your account",
    content: [
      {
        type: "paragraph",
        content:
          "You must be at least 13 years old to register for an account. You are responsible for your account. When you create an account you must provide us with accurate information, in good faith, and you agree to keep your information updated if it changes. If you are under 13 years of age (16 in Europe), you are not authorized to use the Services, with or without registering. In addition, if you are under the age of majority in you jurisdiction (typically 18 years of age), you may use Dreamerz, only with the approval of your parent or guardian. You are responsible for anything that occurs when anyone is signed in to your account, as well as the security of the account. Please contact us immediately if you believe your account is compromised. You can learn more about security on our Security Policy page.",
      },
    ],
  },
  {
    id: "abusive-conduct",
    title: "Abusive conduct",
    content: [
      {
        type: "paragraph",
        content:
          "You are responsible for all activity on your account. If you violate our policies we may terminate your account. Don't do anything illegal, abusive towards others, or any actions which may technically abuse our site. You can find more detailed information in the Security Policy. These policies cover most issues, but if you find a new and creative way to hurt Dreamerz or our community we may take action to prevent it. Dreamerz reserves the right to refuse, or suspend any Dream fulfillment or Wings Donations that we believe in our sole discretion may violate these Terms of Use or harm the interests of our Users, public or Dreamerz. Be responsible and don't violate our policies.",
      },
    ],
  },
  {
    id: "being-a-dreamer",
    title: "Being a Dreamer",
    content: [
      {
        type: "paragraph",
        content:
          "A Dreamer is a person who has its own dream mentioned and described clearly on the platform, that has already subscribed with one of the three packages and started to fulfill other dreams with sharing only one $tar (dollar) for the dream. All the dreams that you will fulfill will be collected on your profile and it will give you the option to double the amount for your dream. The more you give, the more you receive.",
      },
    ],
  },
  {
    id: "membership",
    title: "Membership",
    content: [
      {
        type: "paragraph",
        content:
          "To become a Dreamer, you have to set your dream, describe it clearly for all users, set the amount for the dream that you expect to collect, upload photoes for the dream and start the fulfillment campaign. For fulfilling your dream you have to choose one of three monthly subscription packages and start helping others to fulfill their dreams by sharing one $tar (dollar) for a dream. The subscription packages a based on the monthly payment, and the difference between this packages are just number of the dreams that you plan to fulfill and the price of this packages for a month. The $tars that you will share for other dreams will be collected as fulfilled dreams on your profile, the number of fulfilled dreams that you will collect will give you the option to double the amount for your dream. Before entering the amount for your dream you must first think carefully about how much would you like to give to others and then get double back for your dream. The more you give, the more you recieve ! The dreams on the platform vary and we have limited control over the quality and specific dreams. We attempt to screen for fraudulent Dreamerz pages, but cannot guarantee the identity or the validity of any claims they make. We appreciate your help reporting suspicious Dreamerz pages so we can keep our platform safe.",
      },
    ],
  },
  {
    id: "payments",
    title: "Payments",
    content: [
      {
        type: "paragraph",
        content:
          "As a Dreamer you make your membership available choosing one of the three subscription packages on Dreamerz. We handle payments issues such as fraud, chargebacks and resolution of payments disputes. We may also block or hold payments for violations of our policies or for compliance reasons, including collecting tax reporting information. When payments are delayed or blocked we try to communicate the reason to you promptly. If you have questions about a payments block, please reach out to us.",
      },
    ],
  },
  {
    id: "fees",
    title: "Fees",
    content: [
      {
        type: "paragraph",
        content:
          "As a Dreamer there are two fees associated with your membership on Dreamerz. The first is the platform fee, which varies depending on the subscription package that you have chosed. The second is the payment processing fee in US Dollars is 2.9 % plus $0.30 per successful monthly subscription payment. Depending on your location, some banks may charge you a foreign transaction fee for their subscription. Dreamerz does not control this charge, but it is typically around 3.0% .",
      },
    ],
  },
  {
    id: "tax",
    title: "Tax",
    content: [
      {
        type: "paragraph",
        content:
          "You are responsible for reporting any income or withholding taxes which may be due as a result of payments received. It is solely your responsibility to assess, collect, report or remit the correct tax, if any, to the appropriate tax authority.",
      },
    ],
  },
  {
    id: "being-a-dream-angel",
    title: "Being a Dream Angel",
    content: [
      {
        type: "paragraph",
        content:
          "A Dream Angel is a person who just fulfill's others dreams and share for wings donations. To become a Dream Angel, simply create an account, subscribe with one of the three packages and start to fulfill other dreams with sharing only one $tar (dollar) for the dream. The subscription packages a based on the monthly payment and it can be changed or refreshed whenever you want to. All the dreams that you fulfilled will be collected on your profile for your future dream. Dream Angel can easily become a Dreamer with just creating his own dream and start fulfilling it. The dreams on the platform vary and we have limited control over the quality and specific dreams. We attempt to screen for fraudulent Dreamerz pages, but cannot guarantee the identity or the validity of any claims they make. We appreciate your help reporting suspicious Dreamerz pages so we can keep our platform safe.",
      },
    ],
  },
  {
    id: "dreams",
    title: "Dreams",
    content: [
      {
        type: "paragraph",
        content:
          "To set a dream you just have to describe it clearly for all the Dreamers and Dream Angels, set the amount for the dream that you expect to collect, upload photoes for the dream and start the fulfillment campaign. All the sharing ammount for all the dreams are just one $tar (dollar) for a dream. The dreams can be edited and then verifiyed and accepted, or sent back for some modifications by Dreamerz. For cashing out your dream amount, you have to collect a half of the sum by fulfilling other members dreams. As a administration costs Dreamerz will charge for every fulfilled dream a 10% fee from the whole amount collected to a Dreamer.",
      },
    ],
  },
  {
    id: "wings-donations-terms",
    title: "Wings Donations",
    content: [
      {
        type: "paragraph",
        content:
          "Wings Donations are campaignes organized by Dreamerz with the aim of charity, for helping people from all over the world. For every donation you can share only one $tar (dollar) and the Wings Donations are not collecteble for Dreamerz and Dream Angels, so the donations will be maid without anny expectaitions. As a administration costs Dreamerz will charge for every collected Wings Donations a 10% fee from the whole amount.",
      },
    ],
  },
  {
    id: "member-account-security",
    title: "Member Account, Password and Security",
    content: [
      {
        type: "paragraph",
        content:
          "You are responsible for maintaining the confidentiality of your password and account, if any, and are fully responsible for any and all activities that occur under your password or account. You agree to notify immediately Dreamerz, of any unauthorized use of your password or account or any other breatch of security. Dreamerz will not be liable for any loss or damage arising from your failure to comply with this Section.",
      },
    ],
  },
  {
    id: "account-deletion",
    title: "Account deletion",
    content: [
      {
        type: "paragraph",
        content:
          "You can delete your account if you like to. We can disable your account at our discretion. We can also cancel any membership subscriptions and remove any descriptions, comments or benefits at our discretion. You may not bring a claim against us for suspending or terminating another person's account, and you agree you will not bring such a claim. These terms remain in effect even if you no longer have an account.",
      },
    ],
  },
  {
    id: "your-third-party-apps",
    title: "Your third-party apps",
    content: [
      {
        type: "paragraph",
        content:
          "You may grant Dreamerz access to your third-party accounts, such as Facebook, Instagram in order for some Dreamerz features to operate. Each time you connect your third-party account, that third-party account will present a page that describes the information that Dreamerz can access. At any time, you can revoke Dreamerz's access to those accounts using the respective third party's security settings page. These are the links for each service:",
      },
      {
        type: "bullets",
        items: [
          "Facebook Terms of Service Privacy Policy Revoke Dreamerz's Access",
          "Instagram Terms of Service Privacy Policy Revoke Dreamerz's Access",
        ],
      },
    ],
  },
  {
    id: "dreamerz-creations",
    title: "Dreamerz's creations",
    content: [
      {
        type: "paragraph",
        content:
          "You can use our copyrights or trademarks to promote your Dreamerz page, but can't use them for anything else without our permission. Our creations are protected by copyright, trademark and trade secret laws. Some examples of our creations are the text on the site, our logo, and our codebase. We grant you a license to use our logo and other copyrights or trademarks to promote your Dreamerz page. You may not otherwise use, reproduce, distribute, perform, publicly display or prepare derivative works of our creations unless we give you permission in writing.",
      },
    ],
  },
  {
    id: "indemnity",
    title: "Indemnity",
    content: [
      {
        type: "paragraph",
        content:
          "If we are sued because of your use of or conduct on Dreamerz, you have to help pay for it. You will indemnify us from all losses and liabilities, including legal fees, that arise from these terms or relate to your use of Dreamerz. We reserve the right to exclusive control over the defense of a claim covered by this clause. If we use this right then you will help us in our defense. Your obligation to indemnify under this clause also applies to our subsidiaries, affiliates, officers, directors, employees, agents and third party service providers.",
      },
    ],
  },
  {
    id: "warranty-disclaimer",
    title: "Warranty disclaimer",
    content: [
      {
        type: "paragraph",
        content:
          'We do our best to make sure Dreamerz works as expected, but stuff happens. Dreamerz is provided "as is" and without warranty of any kind. Any warranty of merchantability, fitness for a particular purpose, non-infringement, and any other warranty is excluded to the greatest extent permitted by law. The disclaimers of warranty under this clause also apply to our subsidiaries, affiliates and third party service providers.',
      },
    ],
  },
  {
    id: "limit-of-liability",
    title: "Limit of liability",
    content: [
      {
        type: "paragraph",
        content:
          'If you lose money as a result of using Dreamerz, any payment to you is limited to the amount of money we have earned through your use of Dreamerz. To the extent permitted by law, we are not liable to you for any incidental, consequential or punitive damages arising out of these terms, or your use or attempted use of Dreamerz. To the extent permitted by law, our liability for damages is limited to the amount of money we have earned through your use of Dreamerz. We are specifically not liable for losses associated with unfulfilled benefits and from losses caused by conflicting contractual agreements. For this clause "we" and "our" are defined to include our subsidiaries, affiliates, officers, directors, employees, agents and third party service providers.',
      },
    ],
  },
  {
    id: "dispute-resolution",
    title: "Dispute resolution",
    content: [
      {
        type: "paragraph",
        content:
          "If you have a problem please let us know. Any disputes with us must be resolved in Lewes under Delaware law.We encourage you to contact us if you have an issue. If a dispute does arise out of these terms or in relation to your use of Dreamerz, then the dispute will be resolved in the federal or state courts located in Lewes, Delaware. Both parties consent to the exclusive jurisdiction and venue of the Lewes courts for the purpose of resolving any such dispute.",
      },
    ],
  },
  {
    id: "everything-else",
    title: "Everything else",
    content: [
      {
        type: "paragraph",
        content:
          "These terms are the final word on Dreamerz's policies, and we will let you know if there are any changes. These terms and any referenced policies are the entire agreement between you and us, and supersede all prior agreements. If any provision of these terms is held to be unenforceable, then that provision is modified to the extent necessary to enforce it. If a provision cannot be modified, it is severed from these terms, and all other provisions remain in force. If either party fails to enforce a right provided by these terms, it does not waive the ability to enforce any rights in the future. We may sometimes make changes to these terms and policies. If we make material changes that adversely affect your rights, then we will let you know before the changes come into effect. Continuing to use Dreamerz after a change means you accept the new terms or policies. These terms are an agreement with Dreamerz Group LLC., 16192 Coastal Highway Lewes, Delaware. If you use accessibility tools and have questions or concerns, please contact us at accessibility@dreamerz.net.",
      },
      {
        type: "paragraph",
        content:
          "Effective immediately for users on Dreamerz from July 20 th, 2022.",
      },
    ],
  },
];

export type FAQItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqItems: FAQItem[] = [
  {
    id: "why-use-dreamerz",
    question: "Why should I use Dreamerz.net?",
    answer:
      "Dreamerz gives you the possibility to fulfill other people's dreams and to realize yours.",
  },
  {
    id: "who-can-see-dreams",
    question: "Who can see my dreams on Dreamerz platform?",
    answer:
      "All the dreams on the platform will be public for all users. It is done in order to have a greater impact on viewers and to increase the rate of dream fulfillment for the entire community.",
  },
  {
    id: "use-without-fulfilling",
    question:
      "I don't want to fulfill any dream or to realize mine. Can I still use Dreamerz?",
    answer:
      "Yes, you can use the Dreamerz platform, by watching how other users are fulfilling their dreams, but you will miss the opportunity to fulfill your dreams.",
  },
  {
    id: "how-make-dream",
    question: "How do I make a dream?",
    answer:
      "If you already have an account, access the dream page, describe your dream clearly enter the ammount for your dream, set the photos for it, and start the fulfillment campaign.",
  },
  {
    id: "why-describe-photos",
    question: "Why do I need to describe, and install photos for my dream?",
    answer:
      "You need the description and photos to make your dream more attractive to other users.",
  },
  {
    id: "how-many-dreams",
    question: "How many dreams can a User have?",
    answer:
      "A user can have as many dreams as he wants though only one active is allowed. This means that to create a new dream User needs to fulfill the last one.",
  },
  {
    id: "delete-dream",
    question: "Can a dream be deleted and a new one created?",
    answer:
      "Although the User is not allowed to delete his dream, he might edit it with admin approval.",
  },
  {
    id: "get-money",
    question: "How can I get my money if my dream has been 100 % fulfilled?",
    answer:
      "When your dream is fulfilled, you will be notified that you can withdraw the funds. You can get your money by going to your profile page and clicking the cash out button. The bank account information is required for the transfer to be successful. If all details are provided, Dreamerz will transfer funds to your bank account within 3 to 7 business days.",
  },
  {
    id: "leave-program",
    question:
      "What happens with collected money if I decide to leave the program? Can I donate them?",
    answer:
      "If you decide to leave the platform and you have already collected fulfilled dreams, you will have the option to donate the whole sum with Dreamerz approval.",
  },
  {
    id: "donate-more",
    question: "Can I donate more then 1 $tar (dollar) for a dream?",
    answer:
      "No, you can't donate more then one $tar (dollar) for a dream. You have to donate for multiple users not only one. If the user sets another dream you will be allowed to fulfill it with another $tar.",
  },
  {
    id: "fulfill-without-donating",
    question: "Can I get my dream fulfilled without donating any dollar?",
    answer:
      "Yes. Others can fulfill your dream, but you will not be able to cash out your dream unless you donate at least half of the amount you set aside for it.",
  },
  {
    id: "not-enough-money",
    question:
      "What happens if my dream doesn't get enough money from the dream makers, let's say for … few months?",
    answer:
      "If you don't have activity and your dream is not fulfilled by other users, then you can edit your dream description and photos to make it more attractive, also you can share it on other social network platforms for a bigger impact.",
  },
  {
    id: "edit-amount",
    question: "Can I edit the dream amount after setting it?",
    answer:
      "No you can't edit your dream amount after you have submitted the dream, you can only edit the dream description if you want to.",
  },
  {
    id: "find-friends",
    question:
      "How can i see which friends or family members have already settled their dreams on the Dreamerz platform?",
    answer:
      "You can find them on the dashboard screen, though it will be easier to find them by search functionality.",
  },
  {
    id: "add-friends",
    question: "Can I add friends to my profile or follow other people?",
    answer:
      "No you cant add friends or follow someone on Dreamerz platform, here is all about the community and working together.",
  },
  {
    id: "wings-not-collected",
    question:
      "Why are the wings donations not collected on my profile in the fulfilled section?",
    answer:
      "Wings Donations are campaigns organized by Dreamerz with the aim of charity, and you can only collect donations that you made for other dreamers.",
  },
  {
    id: "get-subscription",
    question:
      "How can I get subscription packages to start fulfilling other people's dreams?",
    answer:
      "If you already have an account created and had skipped the pricing page then you can easily find it in the User's menu, up right corner. As well as by pressing the fulfill button on any dream you want to fulfill, the popup pricing page will be shown automatically and you can choose your best option for a subscription package.",
  },
  {
    id: "cancel-subscription",
    question: "Can I cancel my subscription package?",
    answer:
      "Yes you can cancel your subscription package by pressing cancel subscription button situated on the pricing page.",
  },
  {
    id: "refresh-subscription",
    question:
      "Is the subscription package available only once for a month or it can be refreshed whenever I want?",
    answer:
      "The subscription packages can be refreshed whenever you want by pressing the refresh button on the pricing page, or you can change it to a bigger package.",
  },
  {
    id: "cancel-donation",
    question:
      "If I have donated accidently to a person's dream, can I cancel it?",
    answer:
      "You can't cancel any donations even if you made them by mistake, but you will have it collected on your profile page at the fulfilled section.",
  },
  {
    id: "cashout-fees",
    question: "What are the fees for my dream cash out?",
    answer:
      "For every dream collected and cashed out, Dreamerz will charge 10% from the whole amount.",
  },
];

export type HowItWorksSection = {
  id: string;
  title: string;
  steps: string[];
};

export const howItWorksSections: HowItWorksSection[] = [
  {
    id: "being-dreamer",
    title: "Being a Dreamer",
    steps: [
      "The first step is to Register.",
      "Set up your personal information that is required and add your profile photos.",
      "Choose one of the subscription packages.",
      "Set your dream description, amount and add photos of your dream.",
      "Start your dream fulfilment campaign.",
      "Start Fulfilling other dreams by sharing 1 $tar for a dream.",
      "Collect fulfilled dreams to get the option to double the amount for your dream.",
      "To fulfill and cash out your dream you have to fulfil half of the dreams you've set.",
    ],
  },
  {
    id: "being-dream-angel",
    title: "Being a Dream Angel",
    steps: [
      "The first step is to Register.",
      "Set up your personal information required and add your profile photos.",
      "Choose one of the subscription packages.",
      "Start Fulfilling other's dreams sharing 1 $tar for a dream, collect fulfilled dreams.",
    ],
  },
];

export type AboutUsSection = {
  id: string;
  title: string;
  content: string[];
};

export const aboutUsSections: AboutUsSection[] = [
  {
    id: "we-are-dreamerz",
    title: "We are Dreamerz",
    content: [
      "The most important thing in our life is to dream and then realize all the dreams we have. When there is a dream, there is hope, there is life. Together we can create a world that has never existed before. A world that you have been longing for, and one that will pave the way for a brighter future. Imagine a world full of happiness where dreams come true, where you share and receive back twice that you shared. Together, we will have a much better chance of improving your performance and fulfilling each other's dreams by sharing only one $tar (dollar) for a dream. The good news is that it is never too late to start on a journey to turn your dream into a reality.",
      "This idea also came from a dream, so now we try to help others live better, fulfil their dreams, trying to change the whole world, so lets make it happen. Dream ON!",
      "Let The Dreams be your Wings",
    ],
  },
];
