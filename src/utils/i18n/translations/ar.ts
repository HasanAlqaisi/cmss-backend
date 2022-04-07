export default {
  zod: {
    invalid_type: {
      undefined: "مطلوب",
      default: "يجب ان يكون expected وليس received",
    },
    invalid_enum_value: "قيمة غير صالحة, متوقع الحصول على options",
    invalid_arguments: "قيم الدالة غير صالحة",
    invalid_return_type: "قيمة الدالة الراجعة غير صالحة",
    invalid_date: "تاريخ غير صالح",
    invalid_string: {
      validation: "validation غير صالح",
      default: "غير صالح",
    },
    too_small: {
      array: {
        inclusive: "المصفوفة يجب ان تحتوي على minimum عناصر",
        not_inclusive: "يجب ان تحتوي المصفوفة اكبر من minimum عناصر",
      },
      string: {
        inclusive: "النص يجب ان يحتوي على minimum احرف",
        not_inclusive: "يجب ان يحتوي النص على اكبر من minimum احرف",
      },
      number: {
        inclusive: "الرقم يجب ان يكون minimum او اكبر",
        not_inclusive: "يحب ان يكون الرقم اكبر من minimum",
      },
      default: "ادخال غير صالح",
    },
    too_big: {
      array: {
        inclusive: "يجب ان تحتوي المصفوفة على الاكثر على maximum عناصر",
        not_inclusive: "يجب ان تحتوي المصفوفة على اقل من maximum عناصر",
      },
      string: {
        inclusive: "النص يجب ان يحتوي على الاكثر maximum احرف",
        not_inclusive: "النص يجب ان يحتوي على اقل من maximum احرف",
      },
      number: {
        inclusive: "الرقم يجب ان يكون maximum او اقل",
        not_inclusive: "الرقم يجب ان يكون اقل من maximum",
      },
      default: "ادخال غير صالح",
    },
    custom: "ادخال غير صالح",
    invalid_intersection_types: "تعذر دمج نتائج التقاطع",
    not_multiple_of: "الرقم يجب ان يكون قابل للضرب في multipleOf",
  },

  loginFailed: "فشل تسجيل الدخول.. يرجى التأكد من البيانات",

  serverError: "خطأ في السيرفر",
};
