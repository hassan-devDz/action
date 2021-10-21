export const Messages = {
    //رسائل
    required: `هذا الحقل إلزامي `,
    arabic: `الكتابة باللغة العربية فقط`,
    remote: `يرجى تصحيح هذا الحقل للمتابعة`,
    trim: `احذف المسافات في أول وأخر الكلمة`,
    email: `رجاء إدخال عنوان بريد إلكتروني صحيح`,
    url: `رجاء إدخال عنوان موقع إلكتروني صحيح`,
    date: `رجاء إدخال تاريخ صحيح`,
    dateISO: `رجاء إدخال تاريخ صحيح (ISO)`,
    number: `رجاء إدخال عدد بطريقة صحيحة`,
    digits: `رجاء إدخال أرقام فقط`,
    creditcard: `رجاء إدخال رقم بطاقة ائتمان صحيح`,
    equalTo: `رجاء إدخال نفس القيمة`,
    equalToNum: (num) => `يجب أن يكون  ${num} رقما بالضبط `,
    extension: (extension) => `رجاء إدخال ملف بامتداد ${extension}`,
    maxlength: (maxlength) => `الحد الأقصى لعدد الحروف هو ${maxlength}`,
    minlength: (minlength) => `الحد الأدنى لعدد الحروف هو ${minlength}`,
    rangelength: (minlength, maxlength) =>
      `عدد الحروف يجب أن يكون بين ${minlength} و ${maxlength}`,
    range: (min, max) => `رجاء إدخال عدد قيمته بين ${min} و ${max}`,
    rangeLength: (min, max) => `عدد الارقام يجب أن يكون بين ${min} و ${max}`,
    rangeDate: (min, max) => `رجاء إدخال تاريخ بين ${min} و ${max}`,
    max: (max) => `رجاء إدخال عدد أقل من أو يساوي ${max}`,
    min: (min) => `رجاء إدخال عدد أكبر من أو يساوي ${min}`,
  };
  
 
  