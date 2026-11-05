(function () {
  "use strict";

  const utils = window.SafeWalkUtils;
  const translations = {
    "Select language": "भाषा चुनें",
    "Plan a walk | SafeWalk": "पैदल यात्रा की योजना | SafeWalk",
    "Share your trip | SafeWalk": "अपनी यात्रा साझा करें | SafeWalk",
    "Safety tools | SafeWalk": "सुरक्षा उपकरण | SafeWalk",
    "Skip to main content": "मुख्य सामग्री पर जाएँ",
    "SafeWalk home": "SafeWalk होम",
    "Plan a walk": "पैदल यात्रा की योजना",
    "Share trip": "यात्रा साझा करें",
    "Safety tools": "सुरक्षा उपकरण",
    "Privacy first": "गोपनीयता पहले",
    "Sharing is your choice": "साझा करना आपकी पसंद है",
    "No automatic alerts": "कोई स्वचालित अलर्ट नहीं",
    "You’re offline. Saved pages still work; place search and walking directions need an internet connection.":
      "आप ऑफ़लाइन हैं। सहेजे गए पृष्ठ उपलब्ध हैं; स्थान खोजने और पैदल दिशा-निर्देशों के लिए इंटरनेट चाहिए।",
    "You’re offline. Saved trip details are available; sharing and location links may require a connection.":
      "आप ऑफ़लाइन हैं। सहेरी गई यात्रा जानकारी उपलब्ध है; साझा करने और स्थान लिंक के लिए इंटरनेट चाहिए।",
    "You’re offline. Emergency dial links and local demos remain available; sharing needs a supported app.":
      "आप ऑफ़लाइन हैं। आपातकालीन कॉल लिंक और डेमो उपलब्ध हैं; साझा करने के लिए समर्थित ऐप चाहिए।",
    "A LITTLE MORE PREPARED, EVERY STEP": "हर कदम पर थोड़ी और तैयारी",
    "Plan your walk.": "अपनी पैदल यात्रा की योजना बनाएँ।",
    "Explore a walking route and decide what you’d like to share.":
      "पैदल मार्ग देखें और तय करें कि आप क्या साझा करना चाहते हैं।",
    "Starting point": "शुरुआती स्थान",
    "Your current location": "आपका वर्तमान स्थान",
    "Enter a starting place": "शुरुआती स्थान दर्ज करें",
    "Use my current location": "मेरा वर्तमान स्थान इस्तेमाल करें",
    "Destination": "गंतव्य",
    "Where are you going?": "आप कहाँ जा रहे हैं?",
    "Choose matching places": "मिलते-जुलते स्थान चुनें",
    "Select the correct result for each place.": "हर स्थान के लिए सही परिणाम चुनें।",
    "Show walking route": "पैदल मार्ग दिखाएँ",
    "Enter two places to get started.": "शुरू करने के लिए दोनों स्थान दर्ज करें।",
    "ROUTE SUMMARY": "मार्ग सारांश",
    "Route details": "मार्ग विवरण",
    "Share": "साझा करें",
    "Distance": "दूरी",
    "Walk estimate (4.8 km/h)": "पैदल समय का अनुमान (4.8 किमी/घंटा)",
    "Compare available walking routes": "उपलब्ध पैदल मार्गों की तुलना करें",
    "Estimated at a steady 4.8 km/h. Your actual time may vary with pace, crossings, terrain, and stops.":
      "अनुमानित गति 4.8 किमी/घंटा है। वास्तविक समय चाल, क्रॉसिंग, रास्ते की स्थिति और ठहराव के अनुसार बदल सकता है।",
    "Turn-by-turn directions": "मोड़-दर-मोड़ दिशा-निर्देश",
    "This route and time estimate are not a safety assessment. Check local conditions and trusted official sources before your walk.":
      "यह मार्ग और समय का अनुमान सुरक्षा आकलन नहीं है। निकलने से पहले स्थानीय स्थिति और विश्वसनीय आधिकारिक स्रोत जाँचें।",
    "Edit route": "मार्ग बदलें",
    "Continue to trip sharing": "यात्रा साझा करने के लिए आगे बढ़ें",
    "Recent places": "हाल के स्थान",
    "Clear": "मिटाएँ",
    "Map ©": "मानचित्र ©",
    "Walking route map": "पैदल मार्ग का मानचित्र",
    "Interactive map": "इंटरैक्टिव मानचित्र",
    "Zoom in": "ज़ूम इन करें",
    "Zoom out": "ज़ूम आउट करें",
    "Available walking routes": "उपलब्ध पैदल मार्ग",
    "Searching for a route": "मार्ग खोजा जा रहा है",
    "Location is shared only when you press the button. After browser permission, a one-time map link opens in your chosen sharing app.":
      "स्थान केवल बटन दबाने पर साझा होता है। ब्राउज़र की अनुमति के बाद एक बार का मानचित्र लिंक आपके चुने हुए ऐप में खुलेगा।",
    ". Search and directions use public services. Places and route coordinates are sent to providers when you request a route.":
      "। खोज और दिशा-निर्देश सार्वजनिक सेवाओं का उपयोग करते हैं। अनुरोध करने पर स्थान और मार्ग निर्देशांक सेवा प्रदाताओं को भेजे जाते हैं।",
    "The map loads when it comes into view. An internet connection is needed for map tiles.":
      "मानचित्र दिखाई देने पर लोड होगा। मानचित्र टाइलों के लिए इंटरनेट चाहिए।",
    "Your route appears here": "आपका मार्ग यहाँ दिखाई देगा",
    "Demo only—not emergency response, live tracking, or verified safety data.":
      "केवल डेमो—यह आपातकालीन सेवा, लाइव ट्रैकिंग या सत्यापित सुरक्षा जानकारी नहीं है।",
    "Privacy": "गोपनीयता",
    "Privacy details": "गोपनीयता विवरण",
    "Emergency 112": "आपातकालीन 112",
    "Women Helpline 1091": "महिला हेल्पलाइन 1091",
    "Women Helpline 181": "महिला हेल्पलाइन 181",
    "Plan": "योजना",
    "Safety": "सुरक्षा",
    "WELCOME TO SAFEWALK": "SAFEWALK में आपका स्वागत है",
    "A planning aid, not an emergency service.": "योजना बनाने का साधन, आपातकालीन सेवा नहीं।",
    "Plan a route and choose when to share a message or one-time location. Location is only requested after you press a location button.":
      "मार्ग बनाएँ और तय करें कि संदेश या एक बार का स्थान कब साझा करना है। स्थान की अनुमति केवल स्थान बटन दबाने पर माँगी जाती है।",
    "Location is only requested after you press a location button.":
      "स्थान की अनुमति केवल स्थान बटन दबाने पर माँगी जाती है।",
    "No live tracking or guardian monitoring.": "कोई लाइव ट्रैकिंग या निगरानी नहीं।",
    "No automatic SOS or emergency dispatch.": "कोई स्वचालित SOS या आपातकालीन सहायता प्रेषण नहीं।",
    "No safety ratings or zone data are provided.": "सुरक्षा रेटिंग या क्षेत्र संबंधी डेटा उपलब्ध नहीं कराया जाता।",
    "Place searches and route requests use public map services.":
      "स्थान खोज और मार्ग अनुरोध सार्वजनिक मानचित्र सेवाओं का उपयोग करते हैं।",
    "Read the privacy details": "गोपनीयता विवरण पढ़ें",
    "Read privacy details": "गोपनीयता विवरण पढ़ें",
    "Got it": "समझ गया/गई",
    "KEEP SOMEONE YOU TRUST IN THE LOOP": "अपने विश्वसनीय व्यक्ति को जानकारी दें",
    "Share your trip.": "अपनी यात्रा साझा करें।",
    "Choose trip details or a separate one-time location share. SafeWalk does not create a live tracking link.":
      "यात्रा विवरण या अलग से एक बार का स्थान साझा करें। SafeWalk लाइव ट्रैकिंग लिंक नहीं बनाता।",
    "SAVED IN THIS BROWSER": "इस ब्राउज़र में सहेजा गया",
    "PRIVATE": "निजी",
    "Walk estimate assumes a steady 4.8 km/h; actual time varies with pace, crossings, terrain, and stops.":
      "पैदल समय का अनुमान 4.8 किमी/घंटा की स्थिर गति पर है; वास्तविक समय चाल, क्रॉसिंग, रास्ते की स्थिति और ठहराव के अनुसार बदलता है।",
    "Edit or reopen this route": "यह मार्ग बदलें या फिर खोलें",
    "Share trip details": "यात्रा विवरण साझा करें",
    "Remove saved trip": "सहेजी गई यात्रा हटाएँ",
    "No planned trip yet": "अभी कोई नियोजित यात्रा नहीं",
    "Plan a route to save its start, destination, distance, and estimated walk time in this browser.":
      "शुरुआती स्थान, गंतव्य, दूरी और अनुमानित समय इस ब्राउज़र में सहेजने के लिए मार्ग बनाएँ।",
    "Share my location once": "मेरा स्थान एक बार साझा करें",
    "Get location and share once": "स्थान लेकर एक बार साझा करें",
    "Privacy note": "गोपनीयता सूचना",
    "One-time share is not continuous tracking. SafeWalk has no server, guardian accounts, or live location feed.":
      "एक बार साझा करना लगातार ट्रैकिंग नहीं है। SafeWalk के पास सर्वर, अभिभावक खाते या लाइव स्थान फ़ीड नहीं है।",
    "Trip details stay in this browser until removed.": "यात्रा विवरण हटाए जाने तक इस ब्राउज़र में रहते हैं।",
    "KEEP SOMEONE YOU TRUST IN THE LOOP": "अपने विश्वसनीय व्यक्ति को जानकारी दें",
    "TOOLS TO HELP YOU PREPARE": "तैयारी में मदद के लिए उपकरण",
    "Safety tools.": "सुरक्षा उपकरण।",
    "If you are in immediate danger in India, move to a safer public place if possible and contact emergency services.":
      "भारत में तत्काल खतरे की स्थिति में, यदि संभव हो तो सुरक्षित सार्वजनिक स्थान पर जाएँ और आपातकालीन सेवाओं से संपर्क करें।",
    "Walking safety checklist": "पैदल यात्रा सुरक्षा सूची",
    "Use the steps that fit your plans. Progress is saved on this device.":
      "अपनी योजना के अनुसार चरण चुनें। प्रगति इस डिवाइस पर सहेजी जाती है।",
    "Reset": "रीसेट करें",
    "Before you leave": "निकलने से पहले",
    "Review your route and travel time; check local conditions, weather, daylight, and service availability.":
      "मार्ग और समय देखें; स्थानीय स्थिति, मौसम, दिन का उजाला और सेवाओं की उपलब्धता जाँचें।",
    "Charge your phone, keep it accessible, and make sure you can contact someone if needed.":
      "फ़ोन चार्ज करें, पास रखें और ज़रूरत पड़ने पर किसी से संपर्क करने की तैयारी रखें।",
    "Tell someone you trust where you are going and when you expect to arrive; agree on a check-in if useful.":
      "किसी विश्वसनीय व्यक्ति को अपना गंतव्य और पहुँचने का अनुमानित समय बताएँ; ज़रूरत हो तो संपर्क करने का समय तय करें।",
    "Carry essentials for your needs, such as identification, fare, water, or medication.":
      "अपनी ज़रूरत के अनुसार पहचान पत्र, किराया, पानी या दवा जैसी आवश्यक चीज़ें साथ रखें।",
    "While travelling": "यात्रा के दौरान",
    "Choose well-lit, populated routes when practical, and change plans if conditions feel uncomfortable.":
      "संभव हो तो रोशनी और लोगों वाले मार्ग चुनें; असहज स्थिति लगे तो योजना बदलें।",
    "Stay aware of your surroundings; keep headphone volume low and pause phone use when crossing roads.":
      "आसपास सतर्क रहें; हेडफ़ोन की आवाज़ कम रखें और सड़क पार करते समय फ़ोन न देखें।",
    "Use pedestrian crossings where available and follow local traffic signals.":
      "जहाँ उपलब्ध हो पैदल क्रॉसिंग का उपयोग करें और स्थानीय ट्रैफ़िक संकेतों का पालन करें।",
    "Share your plans or location only with people you trust; avoid posting live location publicly.":
      "अपनी योजना या स्थान केवल विश्वसनीय लोगों से साझा करें; लाइव स्थान सार्वजनिक रूप से पोस्ट न करें।",
    "For public or hired transport, check the service and vehicle details using official or trusted sources.":
      "सार्वजनिक या किराए के वाहन के लिए, आधिकारिक या विश्वसनीय स्रोत से सेवा और वाहन का विवरण जाँचें।",
    "If you feel unsafe or need urgent help": "यदि असुरक्षित महसूस हो या तुरंत सहायता चाहिए",
    "Move toward a well-lit public or staffed place and ask staff or security for help if available.":
      "रोशनी वाले सार्वजनिक या कर्मचारियों की मौजूदगी वाले स्थान पर जाएँ और उपलब्ध होने पर कर्मचारियों या सुरक्षा कर्मियों से मदद माँगें।",
    "Contact someone you trust and tell them your location and what help you need.":
      "किसी विश्वसनीय व्यक्ति से संपर्क करें और अपना स्थान तथा ज़रूरत बताएं।",
    "If there is immediate danger, contact local emergency services. In India, call 112.":
      "तत्काल खतरे में स्थानीय आपातकालीन सेवाओं से संपर्क करें। भारत में 112 पर कॉल करें।",
    "When you arrive": "पहुँचने पर",
    "Let your trusted contact know you arrived, especially if you had agreed on a check-in.":
      "अपने विश्वसनीय संपर्क को पहुँचने की सूचना दें, खासकर यदि आपने संपर्क का समय तय किया था।",
    "Review any location or trip details you shared and stop sharing or remove them when no longer needed.":
      "साझा किए गए स्थान या यात्रा विवरण देखें और ज़रूरत न रहने पर साझा करना बंद करें या उन्हें हटाएँ।",
    "This general checklist cannot cover every situation. Trust your judgment and follow local emergency guidance. SafeWalk does not monitor trips or send alerts automatically.":
      "यह सामान्य सूची हर स्थिति को शामिल नहीं कर सकती। अपने विवेक पर भरोसा करें और स्थानीय आपातकालीन निर्देशों का पालन करें। SafeWalk यात्रा की निगरानी या स्वचालित अलर्ट नहीं भेजता।",
    "INDIA EMERGENCY NUMBER": "भारत का आपातकालीन नंबर",
    "Need emergency help?": "आपातकालीन सहायता चाहिए?",
    "This opens your device’s phone app. SafeWalk cannot place a call or dispatch help.":
      "इससे आपके डिवाइस का फ़ोन ऐप खुलेगा। SafeWalk कॉल नहीं कर सकता या सहायता नहीं भेज सकता।",
    "Call 112": "112 पर कॉल करें",
    "Your trusted contact": "आपका विश्वसनीय संपर्क",
    "Saved on this device only. Use their number to call, or prepare a message and choose a recipient in your share app.":
      "केवल इस डिवाइस पर सहेजा गया। कॉल करने के लिए नंबर इस्तेमाल करें या संदेश तैयार करके साझा करने वाले ऐप में प्राप्तकर्ता चुनें।",
    "Contact name": "संपर्क का नाम",
    "Phone number": "फ़ोन नंबर",
    "For example, Asha": "उदाहरण: आशा",
    "Enter a number you can recognize. SafeWalk does not verify it or send messages automatically.":
      "ऐसा नंबर दर्ज करें जिसे आप पहचानते हों। SafeWalk इसकी पुष्टि या स्वचालित संदेश नहीं भेजता।",
    "Save contact": "संपर्क सहेजें",
    "Remove": "हटाएँ",
    "Call contact": "संपर्क को कॉल करें",
    "Prepare a message for your contact": "अपने संपर्क के लिए संदेश तैयार करें",
    "Message": "संदेश",
    "I need help. Please contact me.": "मुझे मदद चाहिए। कृपया मुझसे संपर्क करें।",
    "Get location and share alert": "स्थान लेकर अलर्ट साझा करें",
    "Location is requested only after you press the button. The alert is not sent until you choose a recipient and send it in your share app.":
      "स्थान की अनुमति केवल बटन दबाने पर माँगी जाती है। प्राप्तकर्ता चुनकर साझा करने वाले ऐप में भेजने तक अलर्ट नहीं भेजा जाता।",
    "Visual fake-call demo": "नकली कॉल का दृश्य डेमो",
    "This is only an on-screen demo. It does not ring, place, or receive a phone call.":
      "यह केवल स्क्रीन पर दिखने वाला डेमो है। यह फ़ोन की घंटी नहीं बजाता, कॉल नहीं करता और कॉल प्राप्त नहीं करता।",
    "Caller name": "कॉल करने वाले का नाम",
    "Trusted contact": "विश्वसनीय संपर्क",
    "Show demo incoming call": "आने वाली कॉल का डेमो दिखाएँ",
    "Quick screen cover": "त्वरित स्क्रीन कवर",
    "Temporarily cover this page. Press Escape or the return button to uncover it.":
      "इस पृष्ठ को अस्थायी रूप से ढकें। हटाने के लिए Escape या वापसी बटन दबाएँ।",
    "Cover screen": "स्क्रीन ढकें",
    "These are optional tools, not emergency response.": "ये वैकल्पिक उपकरण हैं, आपातकालीन सेवा नहीं।",
    "VISUAL DEMO · NO PHONE CALL": "दृश्य डेमो · कोई फ़ोन कॉल नहीं",
    "Incoming call": "आने वाली कॉल",
    "Caller": "कॉलर",
    "No call is being placed or received.": "कोई कॉल नहीं की जा रही या प्राप्त हो रही है।",
    "Close demo": "डेमो बंद करें",
    "SAFEWALK SCREEN COVER": "SAFEWALK स्क्रीन कवर",
    "Notes": "नोट्स",
    "Screen cover is on.": "स्क्रीन कवर चालू है।",
    "Return to SafeWalk": "SafeWalk पर लौटें",
    "Copy directions": "दिशा-निर्देश कॉपी करें",
    "Print directions": "दिशा-निर्देश प्रिंट करें",
    "Copied directions.": "दिशा-निर्देश कॉपी हो गए।",
    "Directions shown for you to copy.": "दिशा-निर्देश कॉपी करने के लिए दिखाए गए हैं।",
    "Copying directions was cancelled.": "दिशा-निर्देश कॉपी करना रद्द किया गया।",
    "Directions": "दिशा-निर्देश",
    "Planned": "योजना बनाई गई",
    "Trip planned in this browser": "इस ब्राउज़र में यात्रा की योजना बनाई गई",
    "My SafeWalk route:": "मेरा SafeWalk मार्ग:",
    "estimated at 4.8 km/h": "4.8 किमी/घंटा की अनुमानित गति से",
    "Demo route only; check local conditions.":
      "केवल डेमो मार्ग; स्थानीय स्थिति जाँचें।",
    "Message copied. Paste it into your chosen app.":
      "संदेश कॉपी हुआ। इसे अपने चुने हुए ऐप में पेस्ट करें।",
    "Copy this SafeWalk message:": "यह SafeWalk संदेश कॉपी करें:",
    "I need help. Please contact me.": "मुझे मदद चाहिए। कृपया मुझसे संपर्क करें।",
    "Please contact": "कृपया संपर्क करें",
    "My current location:": "मेरा वर्तमान स्थान:",
    "Directions aren't available yet.": "दिशा-निर्देश अभी उपलब्ध नहीं हैं।",
    "Print dialog opened.": "प्रिंट संवाद खुल गया।",
    "Export": "निर्यात",
    "Print": "प्रिंट करें",
    "Couldn't copy directions": "दिशा-निर्देश कॉपी नहीं हो सके",
    "Turn-by-turn steps are unavailable for this route.":
      "इस मार्ग के लिए मोड़-दर-मोड़ निर्देश उपलब्ध नहीं हैं।",
    "Turn-by-turn directions are unavailable for this saved trip.":
      "इस सहेजी गई यात्रा के लिए मोड़-दर-मोड़ निर्देश उपलब्ध नहीं हैं।",
    "Start walking": "चलना शुरू करें",
    "Arrive at your destination": "अपने गंतव्य पर पहुँचें",
    "Turn left": "बाएँ मुड़ें",
    "Turn right": "दाएँ मुड़ें",
    "Turn slightly left": "थोड़ा बाएँ मुड़ें",
    "Turn slightly right": "थोड़ा दाएँ मुड़ें",
    "Turn sharply left": "तेज़ बाएँ मुड़ें",
    "Turn sharply right": "तेज़ दाएँ मुड़ें",
    "Make a U-turn": "यू-टर्न लें",
    "Continue": "आगे बढ़ें",
    "Continue straight": "सीधे आगे बढ़ें",
    "Continue along the route": "मार्ग पर आगे बढ़ें",
    "Start:": "शुरुआत:",
    "Destination:": "गंतव्य:",
    "Getting walking directions from the public routing service…":
      "सार्वजनिक मार्ग सेवा से पैदल दिशा-निर्देश लिए जा रहे हैं…",
    "Route ready. Check local conditions before you set off.":
      "मार्ग तैयार है। निकलने से पहले स्थानीय स्थिति जाँचें।",
    "Enter both a starting point and a destination.":
      "शुरुआती स्थान और गंतव्य दोनों दर्ज करें।",
    "You're offline. Connect to the internet to search places and directions.":
      "आप ऑफ़लाइन हैं। स्थान खोजने और दिशा-निर्देशों के लिए इंटरनेट से जुड़ें।",
    "Searching the public place service…": "सार्वजनिक स्थान सेवा में खोज जारी है…",
    "Choose the matching starting point and destination to continue.":
      "आगे बढ़ने के लिए सही शुरुआती स्थान और गंतव्य चुनें।",
    "No saved route was found. Enter places to plan a new walk.":
      "कोई सहेजा हुआ मार्ग नहीं मिला। नई पैदल यात्रा की योजना बनाने के लिए स्थान दर्ज करें।",
    "Route places restored. Edit either place and submit to get updated directions.":
      "मार्ग के स्थान वापस रखे गए। किसी स्थान को बदलकर नए दिशा-निर्देश पाने के लिए सबमिट करें।",
    "Refreshing the saved route. You can edit either place while planning.":
      "सहेजा गया मार्ग फिर से खोजा जा रहा है। योजना बनाते समय आप कोई भी स्थान बदल सकते हैं।",
    "Destination restored. Press “Use my current location” to set the starting point again.":
      "गंतव्य वापस रखा गया। शुरुआती स्थान फिर से तय करने के लिए “मेरा वर्तमान स्थान इस्तेमाल करें” दबाएँ।",
    "Location isn't supported by this browser. Enter a starting place instead.":
      "यह ब्राउज़र स्थान सुविधा का समर्थन नहीं करता। इसके बजाय शुरुआती स्थान दर्ज करें।",
    "Waiting for your location permission…": "स्थान की अनुमति की प्रतीक्षा है…",
    "Starting point set. Location is only used if you request directions.":
      "शुरुआती स्थान तय है। स्थान का उपयोग केवल दिशा-निर्देश माँगने पर होगा।",
    "Couldn't access your location.": "आपका स्थान प्राप्त नहीं हो सका।",
    "Location permission was denied. Enter a starting place instead.":
      "स्थान की अनुमति अस्वीकार की गई। इसके बजाय शुरुआती स्थान दर्ज करें।",
    "Your location couldn't be determined. Try again or enter a place.":
      "आपका स्थान पता नहीं चल सका। फिर कोशिश करें या स्थान दर्ज करें।",
    "Location request timed out. Try again or enter a place.":
      "स्थान अनुरोध का समय समाप्त हुआ। फिर कोशिश करें या स्थान दर्ज करें।",
    "Your location couldn't be determined. Try again or share trip details.":
      "आपका स्थान पता नहीं चल सका। फिर कोशिश करें या यात्रा विवरण साझा करें।",
    "Location permission was denied. You can choose to share trip details instead.":
      "स्थान की अनुमति अस्वीकार की गई। इसके बजाय यात्रा विवरण साझा कर सकते हैं।",
    "Location request timed out. Try again or share trip details.":
      "स्थान अनुरोध का समय समाप्त हुआ। फिर कोशिश करें या यात्रा विवरण साझा करें।",
    "Saved contact removed from this browser.": "सहेजा गया संपर्क इस ब्राउज़र से हटा दिया गया।",
    "Couldn't access your location.": "आपका स्थान प्राप्त नहीं हो सका।",
    "Enter a contact name and a valid phone number (7–15 digits).":
      "संपर्क का नाम और मान्य फ़ोन नंबर दर्ज करें (7–15 अंक)।",
    "Trusted contact saved on this browser only.":
      "विश्वसनीय संपर्क केवल इस ब्राउज़र में सहेजा गया।",
    "Saved trusted contact removed from this browser.":
      "सहेजा गया विश्वसनीय संपर्क इस ब्राउज़र से हटा दिया गया।",
    "Safety checklist progress reset.": "सुरक्षा सूची की प्रगति रीसेट कर दी गई।",
    "Safety checklist progress": "सुरक्षा सूची की प्रगति",
    "Location isn't supported by this browser. Call 112 or share a message without location.":
      "यह ब्राउज़र स्थान सुविधा का समर्थन नहीं करता। 112 पर कॉल करें या स्थान के बिना संदेश साझा करें।",
    "Couldn't access your location.": "आपका स्थान प्राप्त नहीं हो सका।",
    "Couldn't share trip details.": "यात्रा विवरण साझा नहीं हो सका।",
    "Couldn't share location.": "स्थान साझा नहीं हो सका।",
    "Couldn't prepare alert.": "अलर्ट तैयार नहीं हो सका।",
    "Trip details were removed from this browser.":
      "यात्रा विवरण इस ब्राउज़र से हटा दिए गए।",
    "Location isn't supported by this browser. You can share trip details instead.":
      "यह ब्राउज़र स्थान सुविधा का समर्थन नहीं करता। इसके बजाय यात्रा विवरण साझा कर सकते हैं।",
    "Waiting for location permission…": "स्थान की अनुमति की प्रतीक्षा है…",
    "Couldn't access your location.": "आपका स्थान प्राप्त नहीं हो सका।",
    "Share sheet opened. Choose a recipient to send trip details.":
      "साझा करने का विकल्प खुल गया। यात्रा विवरण भेजने के लिए प्राप्तकर्ता चुनें।",
    "Trip details copied. Paste them into a message to your chosen recipient.":
      "यात्रा विवरण कॉपी हो गए। उन्हें अपने चुने हुए व्यक्ति के संदेश में पेस्ट करें।",
    "Trip details shown for you to copy and share.":
      "यात्रा विवरण कॉपी करके साझा करने के लिए दिखाए गए हैं।",
    "Sharing cancelled; no message was sent.": "साझा करना रद्द हुआ; कोई संदेश नहीं भेजा गया।",
    "Share sheet opened. Choose a recipient to send this one-time location link.":
      "साझा करने का विकल्प खुल गया। यह एक बार का स्थान लिंक भेजने के लिए प्राप्तकर्ता चुनें।",
    "One-time location link copied. Paste it into a message to your chosen recipient.":
      "एक बार का स्थान लिंक कॉपी हो गया। इसे अपने चुने हुए व्यक्ति के संदेश में पेस्ट करें।",
    "One-time location link shown for you to copy and share.":
      "एक बार का स्थान लिंक कॉपी करके साझा करने के लिए दिखाया गया है।",
    "Sharing cancelled; no location message was sent.":
      "साझा करना रद्द हुआ; स्थान संदेश नहीं भेजा गया।",
    "Share sheet opened. Choose a trusted recipient and send the alert.":
      "साझा करने का विकल्प खुल गया। विश्वसनीय प्राप्तकर्ता चुनकर अलर्ट भेजें।",
    "Alert copied. Paste it into your chosen app and send it to a trusted person.":
      "अलर्ट कॉपी हुआ। इसे चुने हुए ऐप में पेस्ट करके विश्वसनीय व्यक्ति को भेजें।",
    "Alert shown for you to copy and send to someone you trust.":
      "अलर्ट कॉपी करके विश्वसनीय व्यक्ति को भेजने के लिए दिखाया गया है।",
    "Sharing cancelled; no alert message was sent.":
      "साझा करना रद्द हुआ; कोई अलर्ट संदेश नहीं भेजा गया।",
    "Location permission was denied. Call 112 if you need emergency help.":
      "स्थान की अनुमति अस्वीकार की गई। आपातकालीन सहायता चाहिए तो 112 पर कॉल करें।",
    "Your location couldn't be determined. Call 112 if you need emergency help.":
      "आपका स्थान पता नहीं चल सका। आपातकालीन सहायता चाहिए तो 112 पर कॉल करें।",
    "Location request timed out. Try again or call 112 if needed.":
      "स्थान अनुरोध का समय समाप्त हुआ। फिर कोशिश करें या ज़रूरत पर 112 पर कॉल करें।",
    "Call 112 if you need emergency help.": "आपातकालीन सहायता चाहिए तो 112 पर कॉल करें।",
    "Recent places cleared.": "हाल के स्थान मिटा दिए गए।",
    "Searching places…": "स्थान खोजे जा रहे हैं…",
    "Finding walking directions…": "पैदल दिशा-निर्देश खोजे जा रहे हैं…",
    "Select matching places above": "ऊपर मिलते-जुलते स्थान चुनें",
    "Couldn't get walking directions. Please try again.":
      "पैदल दिशा-निर्देश नहीं मिल सके। फिर कोशिश करें।",
    "Couldn't search for places. Please try again.":
      "स्थान खोजे नहीं जा सके। फिर कोशिश करें।",
    "Selected place": "चुना गया स्थान",
    "Walking directions are unavailable right now. Please try again.":
      "अभी पैदल दिशा-निर्देश उपलब्ध नहीं हैं। फिर कोशिश करें।",
    "No walking route was found. Try closer or different places.":
      "पैदल मार्ग नहीं मिला। पास के या दूसरे स्थान आज़माएँ।",
    "This route and time estimate are not a safety assessment. Check local conditions and trusted official sources before your walk.":
      "यह मार्ग और समय का अनुमान सुरक्षा आकलन नहीं है। निकलने से पहले स्थानीय स्थिति और विश्वसनीय आधिकारिक स्रोत जाँचें।",
    "Directions aren't available yet.": "दिशा-निर्देश अभी उपलब्ध नहीं हैं।",
    "The public place search is busy. Wait a moment and try again.":
      "सार्वजनिक स्थान खोज सेवा व्यस्त है। थोड़ा रुककर फिर कोशिश करें।",
    "The public walking-directions service is busy. Wait a moment and try again.":
      "सार्वजनिक पैदल दिशा-निर्देश सेवा व्यस्त है। थोड़ा रुककर फिर कोशिश करें।",
    "The public place-search service returned an invalid response. Please try again later.":
      "सार्वजनिक स्थान खोज सेवा से अमान्य जवाब मिला। बाद में फिर कोशिश करें।",
    "The public walking-directions service returned an invalid response. Please try again later.":
      "सार्वजनिक पैदल दिशा-निर्देश सेवा से अमान्य जवाब मिला। बाद में फिर कोशिश करें।",
    "The walking-directions service returned an invalid route. Please try again.":
      "पैदल दिशा-निर्देश सेवा से अमान्य मार्ग मिला। फिर कोशिश करें।",
    "The walking-directions service returned an invalid distance. Please try again.":
      "पैदल दिशा-निर्देश सेवा से अमान्य दूरी मिली। फिर कोशिश करें।",
    "Map couldn't load. Check your internet connection and try again.":
      "मानचित्र लोड नहीं हो सका। इंटरनेट कनेक्शन जाँचकर फिर कोशिश करें।",
    "Phone number must contain 7 to 15 digits.": "फ़ोन नंबर में 7 से 15 अंक होने चाहिए।",
    "Emergency": "आपातकालीन",
    "You’re offline.": "आप ऑफ़लाइन हैं।",
  };

  const hindiToEnglish = new Map(
    Object.entries(translations).map(([english, hindi]) => [hindi, english]),
  );
  const languageKey = utils.keys.language;
  let language = utils.getItem(languageKey, "en") === "hi" ? "hi" : "en";
  let observer;

  function translateText(value) {
    const leading = value.match(/^\s*/)[0];
    const text = value.trim();
    if (!text) {
      return value;
    }
    const trailing = value.slice(leading.length + text.length);
    return `${leading}${translateDynamic(text)}${trailing}`;
  }

  function translateNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.parentElement?.closest("script, style, [data-no-translate]")) {
        return;
      }
      const translated = translateText(node.nodeValue);
      if (translated !== node.nodeValue) {
        node.nodeValue = translated;
      }
      return;
    }

    if (!(node instanceof Element) || node.closest("[data-no-translate]")) {
      return;
    }

    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    let textNode;
    while ((textNode = walker.nextNode())) {
      translateNode(textNode);
    }
    [node, ...node.querySelectorAll("*")].forEach((element) => {
      if (element.closest("[data-no-translate]")) {
        return;
      }
      ["aria-label", "placeholder", "title"].forEach((attribute) => {
        if (element.hasAttribute(attribute)) {
          element.setAttribute(attribute, translateText(element.getAttribute(attribute)));
        }
      });
    });
  }

  function applyLanguage() {
    document.documentElement.lang = language;
    if (document.title) {
      document.title = translateText(document.title);
    }
    translateNode(document.body);
    const selector = document.querySelector("#language-select");
    if (selector) {
      selector.value = language;
    }
  }

  function setLanguage(nextLanguage) {
    language = nextLanguage === "hi" ? "hi" : "en";
    utils.setItem(languageKey, language);
    applyLanguage();
    window.dispatchEvent(new CustomEvent("safewalk:languagechange", {
      detail: { language },
    }));
  }

  function translateDynamic(message) {
    const translated = language === "hi"
      ? translations[message]
      : hindiToEnglish.get(message);
    if (translated) {
      return translated;
    }

    let match;
    if (language === "hi") {
      match = message.match(/^Couldn't reach the public (place-search|walking-directions) service\. Check your connection or try again later\.$/);
      if (match) {
        return match[1] === "place-search"
          ? "सार्वजनिक स्थान खोज सेवा से संपर्क नहीं हो सका। इंटरनेट जाँचें या बाद में फिर कोशिश करें।"
          : "सार्वजनिक पैदल दिशा-निर्देश सेवा से संपर्क नहीं हो सका। इंटरनेट जाँचें या बाद में फिर कोशिश करें।";
      }
      match = message.match(/^The public (place-search|walking-directions) service didn't respond in time\. Check your connection or try again later\.$/);
      if (match) {
        return match[1] === "place-search"
          ? "सार्वजनिक स्थान खोज सेवा ने समय पर जवाब नहीं दिया। इंटरनेट जाँचें या बाद में फिर कोशिश करें।"
          : "सार्वजनिक पैदल दिशा-निर्देश सेवा ने समय पर जवाब नहीं दिया। इंटरनेट जाँचें या बाद में फिर कोशिश करें।";
      }
      match = message.match(/^The public place search is temporarily unavailable \(HTTP (\d+)\)\. Try again later\.$/);
      if (match) {
        return `सार्वजनिक स्थान खोज सेवा अभी उपलब्ध नहीं है (HTTP ${match[1]})। बाद में फिर कोशिश करें।`;
      }
      match = message.match(/^The public walking-directions service is temporarily unavailable \(HTTP (\d+)\)\. Try again later\.$/);
      if (match) {
        return `सार्वजनिक पैदल दिशा-निर्देश सेवा अभी उपलब्ध नहीं है (HTTP ${match[1]})। बाद में फिर कोशिश करें।`;
      }
      match = message.match(/^Couldn't find “(.+)”\. Try a nearby street or landmark\.$/);
      if (match) {
        return `“${match[1]}” नहीं मिला। पास की सड़क या पहचान-स्थल आज़माएँ।`;
      }
      match = message.match(/^(\d+) of (\d+) items checked\.(.*)$/);
      if (match) {
        const saved = match[3].includes("couldn't be saved")
          ? " बदलाव सहेजे नहीं जा सके; पृष्ठ बंद होने पर मिट जाएँगे।"
          : " प्रगति इस डिवाइस पर सहेजी गई है।";
        return `${match[2]} में से ${match[1]} आइटम चुने गए।${saved}`;
      }
      match = message.match(/^Couldn't share (.+): (.+)$/);
      if (match) {
        const action = match[1] === "trip details"
          ? "यात्रा विवरण"
          : match[1] === "route details"
            ? "मार्ग विवरण"
            : match[1] === "location"
              ? "स्थान"
              : match[1];
        return `${action} साझा नहीं हो सका: ${match[2]}`;
      }
      match = message.match(/^Couldn't prepare alert: (.+)$/);
      if (match) {
        return `अलर्ट तैयार नहीं हो सका: ${match[1]}`;
      }
      match = message.match(/^The public walking-directions service couldn't calculate this route(?: \(([^)]+)\))?\. Try again later\.$/);
      if (match) {
        return `सार्वजनिक पैदल दिशा-निर्देश सेवा यह मार्ग नहीं निकाल सकी${match[1] ? ` (${match[1]})` : ""}। बाद में फिर कोशिश करें।`;
      }
      match = message.match(/^(.+?) to (.+)$/);
      if (match) {
        return `${match[1]} से ${match[2]} तक`;
      }
      match = message.match(/^Route (\d+)(?: · default)?$/);
      if (match) {
        return `मार्ग ${match[1]}${message.includes("default") ? " · डिफ़ॉल्ट" : ""}`;
      }
      match = message.match(/^Turn (?:(slightly|sharply) )?(left|right)(?: onto (.+))?$/);
      if (match) {
        const modifier = match[1] === "slightly" ? "थोड़ा " : match[1] === "sharply" ? "तेज़ " : "";
        const direction = match[2] === "left" ? "बाएँ" : "दाएँ";
        return `${modifier}${direction} मुड़ें${match[3] ? ` — ${match[3]}` : ""}`;
      }
      match = message.match(/^Continue onto (.+)$/);
      if (match) {
        return `आगे बढ़ें — ${match[1]}`;
      }
      match = message.match(/^Continue along the route(?: onto (.+))?$/);
      if (match) {
        return match[1] ? `मार्ग पर आगे बढ़ें — ${match[1]}` : "मार्ग पर आगे बढ़ें";
      }
      match = message.match(/^At the roundabout, take exit (\d+)(?: onto (.+))?$/);
      if (match) {
        return `गोलचक्कर पर निकास ${match[1]} लें${match[2] ? ` — ${match[2]}` : ""}`;
      }
      match = message.match(/^At the roundabout, follow the route(?: onto (.+))?$/);
      if (match) {
        return `गोलचक्कर पर मार्ग का अनुसरण करें${match[1] ? ` — ${match[1]}` : ""}`;
      }
      match = message.match(/^Merge(?: (left|right))?(?: onto (.+))?$/);
      if (match) {
        const direction = match[1] === "left" ? "बाएँ" : match[1] === "right" ? "दाएँ" : "";
        return `मार्ग में मिलें${direction ? ` ${direction}` : ""}${match[2] ? ` — ${match[2]}` : ""}`;
      }
      match = message.match(/^At the fork, keep (.+?)(?: onto (.+))?$/);
      if (match) {
        const direction = match[1] === "left" ? "बाएँ" : match[1] === "right" ? "दाएँ" : match[1];
        return `दो राहे पर ${direction} की ओर रहें${match[2] ? ` — ${match[2]}` : ""}`;
      }
      match = message.match(/^([\d,.]+)\s*km$/i);
      if (match) {
        return `${match[1]} किमी`;
      }
      match = message.match(/^~?([\d,.]+)\s*min$/i);
      if (match) {
        return `~${match[1]} मिनट`;
      }
      match = message.match(/^([\d,.]+)\s*m$/i);
      if (match) {
        return `${match[1]} मी`;
      }
      match = message.match(/^([\d,.]+) km · ~([\d,.]+) min$/i);
      if (match) {
        return `${match[1]} किमी · लगभग ${match[2]} मिनट`;
      }
    } else {
      match = message.match(/^“(.+)” नहीं मिला। पास की सड़क या पहचान-स्थल आज़माएँ।$/);
      if (match) {
        return `Couldn't find “${match[1]}”. Try a nearby street or landmark.`;
      }
      match = message.match(/^([\d,]+) में से ([\d,]+) आइटम चुने गए।(.*)$/);
      if (match) {
        const saved = match[3].includes("सहेजे नहीं जा सके")
          ? " Changes couldn't be saved; they'll be lost when this page closes."
          : " Progress is saved on this device.";
        return `${match[2]} of ${match[1]} items checked.${saved}`;
      }
      match = message.match(/^(यात्रा विवरण|मार्ग विवरण|स्थान) साझा नहीं हो सका: (.+)$/);
      if (match) {
        const action = match[1] === "यात्रा विवरण"
          ? "trip details"
          : match[1] === "मार्ग विवरण"
            ? "route details"
            : "location";
        return `Couldn't share ${action}: ${match[2]}`;
      }
      match = message.match(/^अलर्ट तैयार नहीं हो सका: (.+)$/);
      if (match) {
        return `Couldn't prepare alert: ${match[1]}`;
      }
      match = message.match(/^सार्वजनिक (स्थान खोज|पैदल दिशा-निर्देश) सेवा से संपर्क नहीं हो सका। इंटरनेट जाँचें या बाद में फिर कोशिश करें।$/);
      if (match) {
        return `Couldn't reach the public ${match[1] === "स्थान खोज" ? "place-search" : "walking-directions"} service. Check your connection or try again later.`;
      }
      match = message.match(/^सार्वजनिक (स्थान खोज|पैदल दिशा-निर्देश) सेवा ने समय पर जवाब नहीं दिया। इंटरनेट जाँचें या बाद में फिर कोशिश करें।$/);
      if (match) {
        return `The public ${match[1] === "स्थान खोज" ? "place-search" : "walking-directions"} service didn't respond in time. Check your connection or try again later.`;
      }
      match = message.match(/^सार्वजनिक (स्थान खोज|पैदल दिशा-निर्देश) सेवा अभी उपलब्ध नहीं है \(HTTP (\d+)\)\u0964 बाद में फिर कोशिश करें।$/);
      if (match) {
        const service = match[1] === "स्थान खोज" ? "place search" : "walking-directions service";
        return `The public ${service} is temporarily unavailable (HTTP ${match[2]}). Try again later.`;
      }
      match = message.match(/^सार्वजनिक पैदल दिशा-निर्देश सेवा यह मार्ग नहीं निकाल सकी(?: \(([^)]+)\))?। बाद में फिर कोशिश करें।$/);
      if (match) {
        return `The public walking-directions service couldn't calculate this route${match[1] ? ` (${match[1]})` : ""}. Try again later.`;
      }
      match = message.match(/^(.+?) से (.+?) तक$/);
      if (match) {
        return `${match[1]} to ${match[2]}`;
      }
      match = message.match(/^मार्ग (\d+)(?: · डिफ़ॉल्ट)?$/);
      if (match) {
        return `Route ${match[1]}${message.includes("डिफ़ॉल्ट") ? " · default" : ""}`;
      }
      match = message.match(/^(?:(थोड़ा|तेज़) )?(बाएँ|दाएँ) मुड़ें(?: — (.+))?$/);
      if (match) {
        const modifier = match[1] === "थोड़ा" ? "slightly " : match[1] === "तेज़" ? "sharply " : "";
        const direction = match[2] === "बाएँ" ? "left" : "right";
        return `Turn ${modifier}${direction}${match[3] ? ` onto ${match[3]}` : ""}`;
      }
      match = message.match(/^आगे बढ़ें — (.+)$/);
      if (match) {
        return `Continue onto ${match[1]}`;
      }
      match = message.match(/^मार्ग पर आगे बढ़ें(?: — (.+))?$/);
      if (match) {
        return `Continue along the route${match[1] ? ` onto ${match[1]}` : ""}`;
      }
      match = message.match(/^गोलचक्कर पर निकास (\d+) लें(?: — (.+))?$/);
      if (match) {
        return `At the roundabout, take exit ${match[1]}${match[2] ? ` onto ${match[2]}` : ""}`;
      }
      match = message.match(/^गोलचक्कर पर मार्ग का अनुसरण करें(?: — (.+))?$/);
      if (match) {
        return `At the roundabout, follow the route${match[1] ? ` onto ${match[1]}` : ""}`;
      }
      match = message.match(/^मार्ग में मिलें(?: (बाएँ|दाएँ))?(?: — (.+))?$/);
      if (match) {
        const direction = match[1] === "बाएँ" ? "left" : match[1] === "दाएँ" ? "right" : "";
        return `Merge${direction ? ` ${direction}` : ""}${match[2] ? ` onto ${match[2]}` : ""}`;
      }
      match = message.match(/^दो राहे पर (.+?) की ओर रहें(?: — (.+))?$/);
      if (match) {
        const direction = match[1] === "बाएँ" ? "left" : match[1] === "दाएँ" ? "right" : match[1];
        return `At the fork, keep ${direction}${match[2] ? ` onto ${match[2]}` : ""}`;
      }
      match = message.match(/^([\d,.]+)\s*किमी$/);
      if (match) {
        return `${match[1]} km`;
      }
      match = message.match(/^~?([\d,.]+)\s*मिनट$/);
      if (match) {
        return `~${match[1]} min`;
      }
      match = message.match(/^([\d,.]+)\s*मी$/);
      if (match) {
        return `${match[1]} m`;
      }
      match = message.match(/^([\d,.]+) किमी · लगभग ([\d,.]+) मिनट$/);
      if (match) {
        return `${match[1]} km · ~${match[2]} min`;
      }
    }
    return message;
  }

  function walkEstimate(distanceKm, minutes) {
    return language === "hi"
      ? `${distanceKm} किमी · लगभग ${minutes} मिनट`
      : `${distanceKm} km · ~${minutes} min`;
  }

  function routeOption(index, isDefault) {
    if (language === "hi") {
      return `मार्ग ${index + 1}${isDefault ? " · डिफ़ॉल्ट" : ""}`;
    }
    return `Route ${index + 1}${isDefault ? " · default" : ""}`;
  }

  function routeTitle(origin, destination) {
    const localizedOrigin = origin === "Your current location"
      ? translateDynamic(origin)
      : origin;
    return language === "hi"
      ? `${localizedOrigin} से ${destination} तक`
      : `${localizedOrigin} to ${destination}`;
  }

  function distance(value) {
    return language === "hi" ? `${value} किमी` : `${value} km`;
  }

  function duration(minutes) {
    return language === "hi" ? `~${minutes} मिनट` : `~${minutes} min`;
  }

  function step(instruction) {
    return translateDynamic(instruction);
  }

  function stepDistance(value) {
    if (language === "hi") {
      return value.replace(/([\d,.]+)\s*km\b/i, "$1 किमी").replace(/([\d,.]+)\s*m\b/i, "$1 मी");
    }
    return value.replace(/([\d,.]+)\s*किमी/g, "$1 km").replace(/([\d,.]+)\s*मी/g, "$1 m");
  }

  const selector = document.querySelector("#language-select");
  selector?.addEventListener("change", () => setLanguage(selector.value));
  applyLanguage();

  observer = new MutationObserver((records) => {
    records.forEach((record) => {
      record.addedNodes.forEach(translateNode);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  window.SafeWalkI18n = {
    get language() {
      return language;
    },
    t: translateDynamic,
    walkEstimate,
    routeOption,
    routeTitle,
    distance,
    duration,
    step,
    stepDistance,
    setLanguage,
  };
})();
