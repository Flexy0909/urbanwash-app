/**
 * UrbanWash Connect - Google Form Generator Script
 * 
 * Instructions:
 * 1. Go to https://script.google.com (or Open Google Forms -> Click 3 Dots -> Script editor)
 * 2. Copy and Paste this entire code.
 * 3. Click "Run" (createUrbanWashForm function).
 * 4. It will instantly generate a live Google Form on your Google Drive with responses linked to Google Sheets!
 */

function createUrbanWashForm() {
  const form = FormApp.create('UrbanWash Connect - Official Laundry Service & Pickup Form');
  form.setDescription('Official Arusha Technical College (ATC) laundry booking & pickup request form. Free hostel pickup & delivery guaranteed!');
  form.setConfirmationMessage('Thank you for submitting your laundry request! Our dispatcher will contact you shortly via WhatsApp/Call.');
  form.setAllowResponseEdits(true);
  form.setAcceptingResponses(true);

  // Q1: Full Name
  form.addTextItem()
    .setTitle('Full Name')
    .setHelpText('Enter your official name as registered at ATC')
    .setRequired(true);

  // Q2: Reg / Admission Number
  form.addTextItem()
    .setTitle('Student Registration / Admission Number')
    .setHelpText('e.g. 25050512146 (Optional)')
    .setRequired(false);

  // Q3: Phone Number
  form.addTextItem()
    .setTitle('Phone Number')
    .setHelpText('Mobile number for pickup calls & SMS alerts (e.g. 07XXXXXXXX or 06XXXXXXXX)')
    .setRequired(true);

  // Q4: WhatsApp Number
  form.addTextItem()
    .setTitle('WhatsApp Phone Number')
    .setHelpText('Enter your WhatsApp contact if different from phone number')
    .setRequired(false);

  // Q5: Hostel Block
  form.addListItem()
    .setTitle('Hostel Block')
    .setChoiceValues(['Hostel 1', 'Hostel 2', 'Hostel 3', 'Hostel 4'])
    .setRequired(true);

  // Q6: Room Code
  form.addTextItem()
    .setTitle('Room Number / Code')
    .setHelpText('e.g. Room 205, H06B')
    .setRequired(true);

  // Q7: Services Requested
  form.addCheckboxItem()
    .setTitle('Services Needed')
    .setChoiceValues([
      'Shirt / T-Shirt (1,000/= Wash & Iron)',
      'Suruali / Trousers / Jeans (1,000/= Wash & Iron)',
      'Shuka / Bed Sheet (1,500/= Wash & Iron)',
      'Kanzu (1,500/= Wash & Iron)',
      'Taulo / Towel (1,500/= Wash & Iron)',
      'Sweta / Hoodie (1,500/= Wash & Iron)',
      'Lab Coat / Uniform (1,500/= Wash & Iron)',
      'Blanket / Duvet Laundry (5,000/= Special Offer)'
    ])
    .setRequired(true);

  // Q8: Service Speed
  form.addMultipleChoiceItem()
    .setTitle('Service Speed')
    .setChoiceValues([
      'Standard Speed (48 - 72 Hours)',
      'Express Speed (Priority up to 4 Hours)'
    ])
    .setRequired(true);

  // Q9: Leaving Campus Date
  form.addMultipleChoiceItem()
    .setTitle('When are you leaving campus?')
    .setChoiceValues([
      'Today (Priority Dispatch)',
      'Tomorrow',
      'Within 3 Days',
      'Next Week / Staying'
    ])
    .setRequired(true);

  // Q10: Preferred Time Slot
  form.addMultipleChoiceItem()
    .setTitle('Preferred Pickup Time Slot')
    .setChoiceValues([
      'Morning (8AM - 11AM)',
      'Afternoon (1PM - 4PM)',
      'Evening (7PM - 10PM)'
    ])
    .setRequired(false);

  // Q11: Special Washing Instructions
  form.addParagraphTextItem()
    .setTitle('Special Washing Instructions / Notes')
    .setHelpText('e.g. Stain removal, separate white clothes, delicate fabric handling');

  // Q12: Rating
  form.addScaleItem()
    .setTitle('Service Expectation Rating')
    .setBounds(1, 5)
    .setLabels('Poor', 'Excellent');

  Logger.log('Form Published URL: ' + form.getPublishedUrl());
  Logger.log('Form Edit URL: ' + form.getEditUrl());
}
