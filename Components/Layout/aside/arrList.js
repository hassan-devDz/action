import AssignmentTwoToneIcon from "@material-ui/icons/AssignmentTwoTone";
import StarBorder from "@material-ui/icons/StarBorder";
//import { FcHome,FcAssistant ,FcCalendar,FcPackage,FcApproval} from "react-icons/fc";
import SendIcon from "@material-ui/icons/Send";

export const list = [
  {
    key: "التقويم ",
    label: "التقويم ",
    icon: StarBorder,
    items: [
      {
        key: "السنوي",
        link: "/sidabar",
        label: "السنوي",
        icon: StarBorder,
      },
    ],
  },
  {
    key: "الرئيسية ",
    label: "الرئيسية ",
    icon: StarBorder,
    items: [{ key: "send", link: "/", label: "Sent Items", icon: SendIcon }],
  },
  {
    key: "الدعم الفني ",
    label: "الدعم الفني ",
    icon: StarBorder,
    items: [],
  },
  {
    key: "قائمة التلاميذ",
    label: "قائمة التلاميذ",
    icon: StarBorder,
    link: "/studentlist",
    items: [],
  },
  {
    key: "دليل الاستخدام ",
    label: "دليل الاستخدام ",
    icon: StarBorder,
    link: "/date",
    items: [
      { key: "send", link: "/calendar", label: "Sent Items", icon: SendIcon },
    ],
  },
  {
    key: "دفتر المناداة",
    label: "دفتر المناداة",
    icon: StarBorder,
    items: [],
    link: "/absences",
  },
  {
    key: "الواجبات المنزلية",
    label: "الواجبات المنزلية",
    icon: StarBorder,
    items: [],
    link: "",
  },
  {
    key: "حسابي",
    label: "حسابي",
    icon: AssignmentTwoToneIcon,
    items: [],
  },
  {
    key: "تمارين مقترحة",
    label: "تمارين مقترحة",
    icon: AssignmentTwoToneIcon,
    items: [],
  },
  {
    key: "التوقيت الاسبوعي",
    label: "التوقيت الاسبوعي",
    icon: AssignmentTwoToneIcon,
    items: [],
    link: "/weeklytime",
  },
  {
    key: "البرنامج الدراسي السنوي",
    label: "البرنامج الدراسي السنوي",
    icon: AssignmentTwoToneIcon,
    items: [],
    link: "/tadaroj",
  },
  {
    key: "دخول",
    label: "دخول",
    icon: AssignmentTwoToneIcon,
    items: [],
    link: "/login",
  },
  {
    key: "تسجيل",
    label: "تسجيل",
    icon: AssignmentTwoToneIcon,
    items: [],
    link: "/login/signup",
  },
];
