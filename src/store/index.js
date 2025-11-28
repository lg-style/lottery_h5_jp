import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import timeUtil from '../util/timeUtil'
//import getters from './getters.js'
Vue.use(Vuex);


// https://webpack.js.org/guides/dependency-management/#requirecontext


// you do not need `import app from './modules/app'`
// it will auto require all vuex module from modules file
const shengxiaoData = {
  '鼠': {
    num: ["05", "17", "29", "41"],
    color: "lhc-red",
    name: '鼠'
  },
  '牛': {
    num: ["04", "16", "28", "40"],
    color: "lhc-red",
    name: '牛'
  },
  '虎': {
    num: ["03", "15", "27", "39"],
    color: "lhc-blue",
    name: '虎'
  },
  '兔': {
    num: ["02", "14", "26", "38"],
    color: "lhc-blue",
    name: '兔'
  },
  '龙': {
    num: ["01", "13", "25", "37", "49"],
    color: "lhc-green",
    name: '龙'
  },
  '蛇': {
    num: ["12", "24", "36", "48"],
    color: "lhc-green",
    name: '蛇'
  },
  '马': {
    num: ["11", "23", "35", "47"],
    color: "lhc-red",
    name: '马'
  },
  '羊': {
    num: ["10", "22", "34", "46"],
    color: "lhc-red",
    name: '羊'
  },
  '猴': {
    num: ["09", "21", "33", "45"],
    color: "lhc-blue",
    name: '猴'
  },
  '鸡': {
    num: ["08", "20", "32", "44"],
    color: "lhc-blue",
    name: '鸡'
  },
  '狗': {
    num: ["07", "19", "31", "43"],
    color: "lhc-green",
    name: '狗'
  },
  '猪': {
    num: ["06", "18", "30", "42"],
    color: "lhc-red",
    name: '猪'
  },
}
const weishuData = {
  '0尾': {
    num: ["10", "20", "30", "40"],
    color: "lhc-red",
    name: '0尾'
  },
  '1尾': {
    num: ["01", "11", "21", "31", "41"],
    color: "lhc-red",
    name: '1尾'
  },
  '2尾': {
    num: ["02", "12", "22", "32", "42"],
    color: "lhc-red",
    name: '2尾'
  },
  '3尾': {
    num: ["03", "13", "23", "33", "43"],
    color: "lhc-red",
    name: '3尾'
  },
  '4尾': {
    num: ["04", "14", "24", "34", "44"],
    color: "lhc-red",
    name: '4尾'
  },
  '5尾': {
    num: ["05", "15", "25", "35", "45"],
    color: "lhc-red",
    name: '5尾'
  },
  '6尾': {
    num: ["06", "16", "26", "36", "46"],
    color: "lhc-red",
    name: '6尾'
  },
  '7尾': {
    num: ["07", "17", "27", "37", "47"],
    color: "lhc-red",
    name: '7尾'
  },
  '8尾': {
    num: ["08", "18", "28", "38", "48"],
    color: "lhc-red",
    name: '8尾'
  },
  '9尾': {
    num: ["09", "19", "29", "39", "49"],
    color: "lhc-red",
    name: '9尾'
  },
}
const optionMap = {
  '特码包三': {
    'list': [],
    'minL': 3,
    'maxL': 3,
  },
  '三中二': {
    'list': [],
    'minL': 3,
    'maxL': 10,
  },
  '三全中': {
    'list': [],
    'minL': 3,
    'maxL': 10,
  },
  '二中特': {
    'list': [],
    'minL': 2,
    'maxL': 10,
  },
  '二全中': {
    'list': [],
    'minL': 2,
    'maxL': 10,
  },
  '特串': {
    'list': [],
    'minL': 2,
    'maxL': 10,
  },
  '四中一': {
    'list': [],
    'minL': 4,
    'maxL': 10,
  },
  '六肖': {
    'list': [],
    'minL': 6,
    'maxL': 6,
  },
  '二肖连': {
    'list': [],
    'minL': 2,
    'maxL': 8,
  },
  '三肖连': {
    'list': [],
    'minL': 3,
    'maxL': 8,
  },
  '四肖连': {
    'list': [],
    'minL': 4,
    'maxL': 8,
  },
  '二尾连': {
    'list': [],
    'minL': 2,
    'maxL': 8,
  },
  '三尾连': {
    'list': [],
    'minL': 3,
    'maxL': 8,
  },
  '四尾连': {
    'list': [],
    'minL': 4,
    'maxL': 8,
  },
  '五不中': {
    'list': [],
    'minL': 5,
    'maxL': 10,
  },
  '六不中': {
    'list': [],
    'minL': 6,
    'maxL': 10,
  },
  '七不中': {
    'list': [],
    'minL': 7,
    'maxL': 10,
  },
  '八不中': {
    'list': [],
    'minL': 8,
    'maxL': 10,
  },
  '九不中': {
    'list': [],
    'minL': 9,
    'maxL': 10,
  },
  '十不中': {
    'list': [],
    'minL': 10,
    'maxL': 10,
  },
  '过关': {
    'list': ['', '', '', '', '', ''],
    'minL': 2,
    'maxL': 6,
    'name': ['', '', '', '', '', ''],
    'odds': ['', '', '', '', '', ''],
  }
}
const state = {
  tishiText: '',
  tishiOpen: false,
  loginOpen: false,//登录过期弹窗
  isiosOpen: false,
  loginUrl: '',
  weishuData: weishuData,
  shengxiaoData: shengxiaoData,
  optionObj: JSON.parse(JSON.stringify(optionMap)),
  oddsTimeObj: null,
  timeObj: null,
  WS_URL: '',
  baseURL: null,
  linkUrlArr: [],
  hotType: 0,
  VersionData: {},
  device: process.env.HOST.indexOf('app') > -1 ? '1' : '0',
  loading: false,//全局加载
  refreshLoad: 0,
  amount: 0,//余额
  noticeShow: false,
  lotteryObj: {},
  GroupList: [],
  userInfo: {},
  tokenUser: {},
  backPoint: 0,//退水
  fanshui: false,
  todayOpenRecord: [],
  serverDate: 0,//服务器时间
  apiData: {
    countDown: 0,
    enable: true,
    start: true,
  },
  lotteryNameList: [
    {
      groupName: '时时彩', name: '', list: [
        { name: '总和', matchId: [72, 73, 74, 75, 76, 77, 78], list: [], show: "1" },
        { name: '第一球', matchId: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], list: [], show: "1,2,3" },
        { name: '第二球', matchId: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29], list: [], show: "1,2,3" },
        { name: '第三球', matchId: [30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43], list: [], show: "1,2,3" },
        { name: '第四球', matchId: [44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57], list: [], show: "1,2,3" },
        { name: '第五球', matchId: [58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71], list: [], show: "1,2,3" },
        { name: '前三', matchId: [79, 80, 81, 82, 83], list: [], show: "4" },
        { name: '中三', matchId: [84, 85, 86, 87, 88], list: [], show: "4" },
        { name: '后三', matchId: [89, 90, 91, 92, 93], list: [], show: "4" },
      ]
    },
    // PK10
    {
      groupName: 'PK10', name: '', list: [
        { name: '冠军和', matchId: [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220], list: [], show: "4" },
        { name: '冠军', matchId: [221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236], list: [], show: "1,2,3" },
        { name: '亚军', matchId: [237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252], list: [], show: "1,2,3" },
        { name: '第三名', matchId: [253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265, 266, 267, 268], list: [], show: "1,2,3" },
        { name: '第四名', matchId: [269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284], list: [], show: "1,2,3" },
        { name: '第五名', matchId: [285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300], list: [], show: "1,2,3" },
        { name: '第六名', matchId: [301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311, 312, 313, 314], list: [], show: "1,2,3" },
        { name: '第七名', matchId: [315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328], list: [], show: "1,2,3" },
        { name: '第八名', matchId: [329, 330, 331, 332, 333, 334, 335, 336, 337, 338, 339, 340, 341, 342], list: [], show: "1,2,3" },
        { name: '第九名', matchId: [343, 344, 345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356], list: [], show: "1,2,3" },
        { name: '第十名', matchId: [357, 358, 359, 360, 361, 362, 363, 364, 365, 366, 367, 368, 369, 370], list: [], show: "1,2,3" },
      ]
    },
    // 六合彩
    {
      groupName: '六合彩', name: '', list: [
        {
          name: '特码', matchId: [
            553, 554, 555, 556, 557,
            558, 559, 560, 561, 562,
            563, 564, 565, 566, 567,
            568, 569, 570, 571, 572,
            573, 574, 575, 576, 577,
            578, 579, 580, 581, 582,
            583, 584, 585, 586, 587,
            588, 589, 590, 591, 592,
            593, 594, 595, 596, 597,
            598, 599, 600, 601
          ], list: [], show: "1"
        },
        {
          name: '特码双面', matchId: [
            602, 603, 604, 605, 606,
            607, 608, 609, 610, 611,
            612, 613, 614, 615, 616,
            617, 618
          ], list: [], show: "2"
        },
        {
          name: '正码', matchId: [
            619, 620, 621, 622, 623,
            624, 625, 626, 627, 628,
            629, 630, 631, 632, 633,
            634, 635, 636, 637, 638,
            639, 640, 641, 642, 643,
            644, 645, 646, 647, 648,
            649, 650, 651, 652, 653,
            654, 655, 656, 657, 658,
            659, 660, 661, 662, 663,
            664, 665, 666, 667
          ], list: [], show: "3"
        },
        {
          name: '正1特', matchId: [
            668, 669, 670, 671, 672,
            673, 674, 675, 676, 677,
            678, 679, 680, 681, 682,
            683, 684, 685, 686, 687,
            688, 689, 690, 691, 692,
            693, 694, 695, 696, 697,
            698, 699, 700, 701, 702,
            703, 704, 705, 706, 707,
            708, 709, 710, 711, 712,
            713, 714, 715, 716
          ], list: [], show: "3"
        },
        {
          name: '正2特', matchId: [
            717, 718, 719, 720, 721,
            722, 723, 724, 725, 726,
            727, 728, 729, 730, 731,
            732, 733, 734, 735, 736,
            737, 738, 739, 740, 741,
            742, 743, 744, 745, 746,
            747, 748, 749, 750, 751,
            752, 753, 754, 755, 756,
            757, 758, 759, 760, 761,
            762, 763, 764, 765
          ], list: [], show: "3"
        },
        {
          name: '正3特', matchId: [
            766, 767, 768, 769, 770,
            771, 772, 773, 774, 775,
            776, 777, 778, 779, 780,
            781, 782, 783, 784, 785,
            786, 787, 788, 789, 790,
            791, 792, 793, 794, 795,
            796, 797, 798, 799, 800,
            801, 802, 803, 804, 805,
            806, 807, 808, 809, 810,
            811, 812, 813, 814
          ], list: [], show: "3"
        },
        {
          name: '正4特', matchId: [
            815, 816, 817, 818, 819,
            820, 821, 822, 823, 824,
            825, 826, 827, 828, 829,
            830, 831, 832, 833, 834,
            835, 836, 837, 838, 839,
            840, 841, 842, 843, 844,
            845, 846, 847, 848, 849,
            850, 851, 852, 853, 854,
            855, 856, 857, 858, 859,
            860, 861, 862, 863
          ], list: [], show: "3"
        },
        {
          name: '正5特', matchId: [
            864, 865, 866, 867, 868,
            869, 870, 871, 872, 873,
            874, 875, 876, 877, 878,
            879, 880, 881, 882, 883,
            884, 885, 886, 887, 888,
            889, 890, 891, 892, 893,
            894, 895, 896, 897, 898,
            899, 900, 901, 902, 903,
            904, 905, 906, 907, 908,
            909, 910, 911, 912
          ], list: [], show: "3"
        },
        {
          name: '正6特', matchId: [
            913, 914, 915, 916, 917,
            918, 919, 920, 921, 922,
            923, 924, 925, 926, 927,
            928, 929, 930, 931, 932,
            933, 934, 935, 936, 937,
            938, 939, 940, 941, 942,
            943, 944, 945, 946, 947,
            948, 949, 950, 951, 952,
            953, 954, 955, 956, 957,
            958, 959, 960, 961
          ], list: [], show: "3"
        },
        {
          name: '正1双面', matchId: [
            962, 963, 964, 965, 966,
            967, 968, 969, 970, 971,
            972, 973, 974
          ], list: [], show: "3"
        },
        {
          name: '正2双面', matchId: [
            975, 976, 977, 978, 979,
            980, 981, 982, 983, 984,
            985, 986, 987
          ], list: [], show: "3"
        },
        {
          name: '正3双面', matchId: [
            988, 989, 990, 991, 992,
            993, 994, 995, 996, 997,
            998, 999, 1000
          ], list: [], show: "3"
        },
        {
          name: '正4双面', matchId: [
            1001, 1002, 1003, 1004, 1005,
            1006, 1007, 1008, 1009, 1010,
            1011, 1012, 1013
          ], list: [], show: "3"
        },
        {
          name: '正5双面', matchId: [
            1014, 1015, 1016, 1017, 1018,
            1019, 1020, 1021, 1022, 1023,
            1024, 1025, 1026
          ], list: [], show: "3"
        },
        {
          name: '正6双面', matchId: [
            1027, 1028, 1029, 1030, 1031,
            1032, 1033, 1034, 1035, 1036,
            1037, 1038, 1039
          ], list: [], show: "3"
        },
        {
          name: '三中二', matchId: [
            1040, 1041
          ], list: [], show: "4"
        },
        {
          name: '二中特', matchId: [
            1042, 1043
          ], list: [], show: "4"
        },
        {
          name: '三全中', matchId: [
            1044
          ], list: [], show: "4"
        },
        {
          name: '二全中', matchId: [
            1045
          ], list: [], show: "4"
        },
        {
          name: '特串', matchId: [
            1046
          ], list: [], show: "4"
        },
        {
          name: '四中一', matchId: [
            1047
          ], list: [], show: "4"
        },
        {
          name: '特码半波', matchId: [
            1048, 1049, 1050, 1051, 1052,
            1053, 1054, 1055, 1056, 1057,
            1058, 1059, 1060, 1061, 1062,
            1063, 1064, 1065
          ], list: [], show: "5"
        },
        {
          name: '特肖', matchId: [
            1066, 1067, 1068, 1069, 1070,
            1071, 1072, 1073, 1074, 1075,
            1076, 1077
          ], list: [], show: "6"
        },
        {
          name: '一肖', matchId: [
            1078, 1079, 1080, 1081, 1082,
            1083, 1084, 1085, 1086, 1087,
            1088, 1089
          ], list: [], show: "6"
        },
        {
          name: '六肖', matchId: [
            1090
          ], list: [], show: "6"
        },
        {
          name: '尾数', matchId: [
            1091, 1092, 1093, 1094, 1095,
            1096, 1097, 1098, 1099, 1100
          ], list: [], show: "6"
        },
        {
          name: '二肖连', matchId: [
            1101, 1102
          ], list: [], show: "7"
        },
        {
          name: '三肖连', matchId: [
            1103, 1104
          ], list: [], show: "7"
        },
        {
          name: '四肖连', matchId: [
            1105, 1106
          ], list: [], show: "7"
        },
        {
          name: '二尾连', matchId: [
            1107, 1108
          ], list: [], show: "8"
        },
        {
          name: '三尾连', matchId: [
            1109, 1110
          ], list: [], show: "8"
        },
        {
          name: '四尾连', matchId: [
            1111, 1112
          ], list: [], show: "8"
        },
        {
          name: '五不中', matchId: [
            1113
          ], list: [], show: "9"
        },
        {
          name: '六不中', matchId: [
            1114
          ], list: [], show: "9"
        },
        {
          name: '七不中', matchId: [
            1115
          ], list: [], show: "9"
        },
        {
          name: '八不中', matchId: [
            1116
          ], list: [], show: "9"
        },
        {
          name: '九不中', matchId: [
            1117
          ], list: [], show: "9"
        },
        {
          name: '十不中', matchId: [
            1118
          ], list: [], show: "9"
        },
        {
          name: '趣味', matchId: [
            1119, 1120, 1121, 1122, 1123,
            1124, 1125, 1126, 1127, 1128,
            1129, 1130, 1131, 1132, 1133,
            1134
          ], list: [], show: "10"
        },
        {
          name: '过关', matchId: [
            962, 963, 964, 965, 972, 973, 974,//正1双面（大小单双红蓝绿）
            975, 976, 977, 978, 985, 986, 987,//正2双面（大小单双红蓝绿）
            988, 989, 990, 991, 998, 999, 1000,//正3双面（大小单双红蓝绿）
            1001, 1002, 1003, 1004, 1011, 1012, 1013,//正4双面（大小单双红蓝绿）
            1014, 1015, 1016, 1017, 1024, 1025, 1026,//正5双面（大小单双红蓝绿）
            1027, 1028, 1029, 1030, 1037, 1038, 1039//正6双面（大小单双红蓝绿）
          ], list: [], show: "11"
        },
      ]
    },
    // 幸运28（快乐彩票）
    {
      groupName: '快乐彩', name: '', list: [
        {
          name: '和值', matchId: [
            510, 511, 512, 513, 514,
            515, 516, 517, 518, 519,
            520, 521, 522, 523, 524,
            525, 526, 527, 528, 529,
            530, 531, 532, 533, 534,
            535, 536, 537
          ], list: [], show: "1"
        },
        {
          name: '两面', matchId: [
            538, 539, 540, 541, 542,
            543, 544, 545, 546, 547
          ], list: [], show: "1"
        },
        {
          name: '色波', matchId: [
            548, 549, 550
          ], list: [], show: "1"
        },
        {
          name: '豹子', matchId: [
            551
          ], list: [], show: "1"
        },
        {
          name: '特码包三', matchId: [
            552
          ], list: [], show: "2"
        },
      ]
    },
    {
      groupName: '快三', name: '', list: [
        {
          name: '和值', matchId: [
            94, 95, 96, 97, 98, 99, 100, 101, 102, 103,
            104, 105, 106, 107, 108, 109, 110, 111, 112, 113,
            114, 115, 116, 117
          ], list: [], show: "1", text: '投注3个开奖号码相加之和，3-10位小，11-18为大。', oddsShow: false
        },
        { name: '三同号通选', matchId: [118], list: [], show: "2", text: '对所有相同的三个号码进行投注，三个号码相同即为中奖。', oddsShow: false },
        { name: '三同号单选', matchId: [436, 437, 438, 439, 440, 441], list: [], show: "3", text: '对所有相同的三个号码中的一个或多个进行投注，所选号码开出即为中奖。', oddsShow: false },
        {
          name: '三不同号', matchId: [
            371, 372, 373, 374, 375, 376, 377, 378, 379, 380,
            381, 382, 383, 384, 385, 386, 387, 388, 389, 390,
          ], list: [], show: "4", text: '从1-6中任选3个或多个号码，所选号码与开奖号码的三个号码相同，即为中奖。', oddsShow: false
        },
        { name: '三连号通选', matchId: [121], list: [], show: "5", text: '对所有的三个相连号码(123、234、345、456)进行投注，任意号码开出，即为中奖。', oddsShow: false },
        { name: '二同号复选', matchId: [442, 443, 444, 445, 446, 447], list: [], show: "6", text: '从11-66中任选1个或多个号码，选号与中奖号码 相同，即为中奖(不含豹子)。', oddsShow: false },
        {
          name: '二同号单选', matchId: [
            406, 407, 408, 409, 410, 411, 412, 413, 414, 415,
            416, 417, 418, 419, 420, 421, 422, 423, 424, 425,
            426, 427, 428, 429, 430, 431, 432, 433, 434, 435,
          ], list: [], show: "7", text: '选择一对相同号码和一个不同号码进行投注，选号与奖号相同，即为中奖。', oddsShow: false
        },
        {
          name: '二不同号', matchId: [
            391, 392, 393, 394, 395, 396, 397, 398, 399, 400,
            401, 402, 403, 404, 405
          ], list: [], show: "8", text: '从1-6中任选2个或多个号码，所选号码与开奖号码任意2个号码相同，即为中奖。', oddsShow: false
        },
        {
          name: '四码黑', matchId: [
            125, 126, 127, 128, 129, 130, 131, 132, 133, 134,
            135, 136, 137, 138, 139
          ], list: [], show: "9", text: '投注4个号码，开出奖号为3个不同号码全部在投注的号码当中，即为中奖。', oddsShow: false
        },
        {
          name: '四码红', matchId: [
            140, 141, 142, 143, 144, 145, 146, 147, 148, 149,
            150, 151, 152, 153, 154
          ], list: [], show: "10",
          text: '投注 4 个号码，三个开奖号码其中有两个号码是相同的并且开出的号码全部都在所选的 4 个投注号码当中(例如投注 1234，若开出 112、113、114、223、224、334、344)则视为中奖。', oddsShow: false
        },
        {
          name: '五码黑', matchId: [155, 156, 157, 158, 159, 160], list: [], show: "11",
          text: '投注 5 个号码，开出奖号为三个不同号码全部在所选的 5 个投注号码中(例如投注 12345，若开出123、124、125、234、235、245、345)则视为中奖。', oddsShow: false
        },
        { name: '红黑码/豹', matchId: [161, 162, 163, 164, 165, 166], list: [], show: "12", text: '投注3个开奖号码相加之和', oddsShow: false },
        {
          name: '三军', matchId: [167, 168, 169, 170, 171, 172], list: [], show: "13",
          text: '任何一投注号码出现在开出的号码中，即为中奖【中奖结果：一同骰=（赔率-1）X1、二同骰=(赔率-1)x2、三同骰=(赔率-1)x3】', oddsShow: false
        },
        {
          name: '跨度', matchId: [173, 174, 175, 176, 177], list: [], show: "14",
          text: '跨度为开出奖号的最大数与最小值之差值为跨度(例如开出123则为2跨)。', oddsShow: false
        },
        {
          name: '过关', matchId: [178, 179, 180, 181, 182, 183, 184, 185], list: [], show: "15",
          text: '开出奖号属于红码，且和值为单则为红单，若和值为双即为红双；开出奖号属于红码，且和值为大则为红大，若和值为小即为红小；开出奖号属于黑码，且和值为单则为黑单，若和值为双即为黑双；开出奖号属于黑码，且和值为大则为黑大，若和值为小即为黑小。', oddsShow: false
        },
        {
          name: '骰面不中', matchId: [186, 187, 188], list: [], show: "16",
          text: '豹子：开奖号码不出现三个同号，即为中奖\n' +
            '对子：开奖号码不出现对子，即为中奖\n' +
            '炼单：开奖号码不出现全异数字，即为中奖', oddsShow: false
        },
        { name: '和值不中', matchId: [189, 190, 191, 192, 193], list: [], show: "17", text: '当开奖号码和值不出现与投注所选和值中时，即为中奖。', oddsShow: false },
        {
          name: '不中', matchId: [
            448, 449, 450, 451, 452, 453, 454, 455, 456, 457,
            458, 459, 460, 461, 462, 463, 464, 465, 466, 467,
            468, 469, 470, 471, 472, 473, 474, 475, 476, 477,
            478, 479, 480, 481, 482, 483, 484, 485, 486, 487,
            488, 489, 490, 491, 492, 493, 494, 495, 496, 497,
            498, 499, 500, 501, 502, 503, 504, 505, 506, 507,
            508, 509
          ], list: [], show: "18", text: '当开奖号码中不出现投注所选号码时，即为中奖。', oddsShow: false
        },
      ]
    },
  ],
}
let state2 = {
  // 七码合一缓存
  mixCurrencyList: [],
  mixCurrencyData: {},
  // 代理报表缓存
  agentData: null,
  agentLotteryData: null,
  agentDataObj: {
    10002: {},
    10039: {},
  },
  // 下级报表缓存
  subLevelReportTotal: 0,
  subLevelReportList: null,
  // 个人报表缓存
  personData: null,
  // 会员管理缓存
  memberTotal: 0,
  memberList: null,
  // 邀请码管理缓存
  inviteCodeTotal: 0,
  inviteCodeList: null,
  // 下载地址
  downloadUrl: ''
};
const store = new Vuex.Store({
  state: sessionStorage.getItem('state') ? Object.assign(JSON.parse(sessionStorage.getItem('state')), state2) : Object.assign(state, state2),
  mutations: {
    // 提示弹窗
    SET_TISHI(state, text) {
      console.log(text);
      state.tishiText = text;
      state.tishiOpen = text ? true : false;
    },
    SET_optionObj(state, data) {
      state.optionObj = JSON.parse(JSON.stringify(optionMap));
      state.shengxiaoData = JSON.parse(JSON.stringify(shengxiaoData));
    },
    getDate(state, data) {
      clearInterval(state.timeObj)
      state.timeObj = setInterval(() => {
        if (state.apiData.countDown > 0) {
          state.apiData.countDown -= 1000
        } else if (!state.apiData.start) {
          setTimeout(() => {
            // window.location.reload()
          }, 300)
        }
        state.serverDate += 1
      }, 1000)
    },
  },
  actions: {
    // 获取收款二维码配置
    userCompanyMixCurrencyList({ commit, state }, data) {
      return new Promise(resolve => {
        axios.post("/cashin/userCompanyMixCurrencyList")
          .then((res) => {
            if (res.data) {
              for (let k of res.data) {
                k.depositor = state.userInfo.realName;
                k.text = k.channelName;
                k.amount2 = 0;
              }
              function sortId(a, b) {
                return b.mixSort - a.mixSort;
              }
              res.data = res.data.sort(sortId);
              state.mixCurrencyList = res.data || [];
              state.mixCurrencyData = res.data[0] || {};
              resolve();
            }
          })
      })
    },
    //isNewVersion
    isNewVersion({ commit, state }, data) {
      let url = `${window.location.origin}/static/version.json?t=${new Date().getTime()}`;
      axios.get(url
      ).then(res => {
        if (res.version) {
          let vueVersion = res.version,
          localVueVersion = localStorage.getItem('vueVersion');
          if (localVueVersion && localVueVersion != vueVersion) {
            // alert('当前版本有更新，点击确认立即体验')
            localStorage.setItem('vueVersion', vueVersion);
            window.location.reload();
            return;
          } else {
            localStorage.setItem('vueVersion', vueVersion);
          }
        }
      })
    },
    //查询余额
    onrefreshLoad({ commit, state }, data) {
      state.refreshLoad = true
      axios.post(`/user/center/refreshAmount`
      ).then(res => {
        state.amount = res.data || {};
      }).finally(() => {
        state.refreshLoad = false
      })
    },
    //获取个人信息
    getInfo({ commit, state }, data) {
      axios.post('/user/center/info').then(res => {
        if (res.data.birthday && res.data.birthda != '') {
          res.data.birthday = res.data.birthday.split(' ')[0]
        }
        state.userInfo = res.data
      })
    },
    //获取当前彩票列表
    onGetlottery({ commit, state, dispatch }, data) {
      clearTimeout(state.oddsTimeObj);
      axios.post(`/lottery/odds?lotteryId=${state.lotteryObj.id}`
      ).then(res => {
        state.lotteryNameList.map(obj => {
          if (obj.groupName == state.lotteryObj.groupName) {
            obj.list.map(k => {
              k.list = []
              res.data.map(n => {
                if (k.matchId.filter(m => { return m === n.id }).length > 0) {
                  n.betAmount = null
                  k.list.push(n)
                }
              })
            })
          }
        })
      }).finally(() => {
        if (window.location.hash.indexOf('lottery') > -1) {
          state.oddsTimeObj = setTimeout(() => {
            dispatch('onGetlottery');
            // dispatch('onrefreshLoad');
          }, 60000);
        }
      })
    },
    //获取当前期数数据
    onGetBetData({ commit, state, dispatch }, data) {
      return new Promise(resolve => {
        // state.loading = true
        axios.post(`/lottery/index?lotteryId=${state.lotteryObj.id}`
        ).then(res => {
          state.apiData = res.data
          state.serverDate = Date.parse(new Date(res.data.serverDate.replace(/-/g, '/'))) / 1000

          if (state.apiData.order) {
            
          } else {
            clearTimeout(state.oddsTimeObj);
          }
          resolve(res);
        }).finally(() => {
          // state.loading = false
        })
      });
    },
  },
})

export default store



