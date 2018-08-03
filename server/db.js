/**
 * 设置数据库相关
 */
// Schema、Model、Entity或者Documents的关系请牢记，Schema生成Model，Model创造Entity，Model和Entity都可对数据库操作造成影响，但Model比Entity更具操作性。
const mongoose = require('mongoose');
// 连接数据库 如果不自己创建 默认test数据库会自动生成
mongoose.connect('mongodb://localhost:27017/admission', {useMongoClient: true});

// 此处防止 node.js - Mongoose: mpromise 错误
mongoose.Promise = global.Promise;

// 为这次连接绑定事件
const db = mongoose.connection;
db.once('error', () => console.log('Mongo connection error'));
db.once('open', () => console.log('Mongo connection successed'));
/************** 定义模式Schema **************/
// adminSchema: 管理员
const adminSchema = mongoose.Schema({
  admin_id: {type: String, required: true},  // 工号
  admin_type: {type: String, required: true},  // 管理员类型：0——超级管理员，1——普通管理员
  admin_name: {type: String},  // 姓名
  admin_phone: {type: String},  // 电话
  admin_pass: {type: String, required: true},  // 密码
  admin_avatar: {type: String},  // 头像
  create_time: {type: Date, default: Date.now},
  update_time: {type: Date, default: Date.now}
}, {
  versionKey: false,
  timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}
});

// sliderSchema: 轮播图配置
const sliderSchema = mongoose.Schema({
  slider_id: {type: String},
  slider_pic: String,
  slider_intro: String,
  create_time: {
    type: Date,
    default: Date.now
  },
  update_time: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}
});

// noticeSchema: 公告
const noticeSchema = mongoose.Schema({
  notice_id: String,
  notice_type: String,
  notice_url: String,
  notice_content: String,
  notice_title: String,
  create_time: {
    type: Date,
    default: Date.now
  },
  update_time: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}
});

// profession 专业介绍
const professionSchema = mongoose.Schema({
  profession_id: String,
  profession_name: String,
  profession_desc: String,
  profession_pic: String,
  questions: [{type: mongoose.Schema.Types.ObjectId, ref: 'Question'}]
});

// question  专业问题
const questionSchema = mongoose.Schema({
  question_id: String,
  question_title: String,
  question_answer: String,
  profession_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profession'
  },  // 子表的外键，关联主表
  profession_name: { type: String }
});

// employment  就业信息
const employmentSchema = mongoose.Schema({
  employment_id: {type: String},
  employment_title: {type: String},
  employment_content: {type: String},
  create_time: {
    type: Date,
    default: Date.now
  },
  update_time: {
    type: Date,
    default: Date.now
  }
})

const studentSchema = mongoose.Schema({
  student_id: {type: String, required: true},  // 身份证
  student_interested: {type: String},  // 意向专业
  student_isAdmitted: {type: String},  // 是否录取，0--待审核，1--录取，-1--未录取
  student_phone: {type: String},  // 学生电话
  student_name: {type: String},  // 学生姓名
  student_pass: {type: String},  // 学生密码
  student_answer: {type: String},
  student_question: {type: String},
  create_time: {
    type: Date,
    default: Date.now
  },
  update_time: {
    type: Date,
    default: Date.now
  }
}, {
  versionKey: false,
  timestamps: {createdAt: 'create_time', updatedAt: 'update_time'}
});

// admission  招生计划ZSJH、历史录取LSLQ
const admissionSchema = mongoose.Schema({
  admission_vintage: {type: String},  // 年份
  admission_content: {type: String},  // 招生计划、历史录取内容
  admission_type: {type: String},  // ZSJH、LSLQ
  create_time: {
    type: Date,
    default: Date.now
  },
  update_time: {
    type: Date,
    default: Date.now
  }
});

// college  学院实力
const collegeSchema = mongoose.Schema({
  college_title: {type: String},  // 类别名称
  college_content: {type: String},  // 类别内容
  create_time: {
    type: Date,
    default: Date.now
  },
  update_time: {
    type: Date,
    default: Date.now
  }
});

const infoSchema = mongoose.Schema({
  student_id: {type: String},
  answer: {type: String},
  question: {type: String},
  create_time: {
    type: Date,
    default: Date.now
  },
  update_time: {
    type: Date,
    default: Date.now
  }
})

/************** 定义模型Model **************/
const Models = {
  Admin: mongoose.model('Admin', adminSchema),
  Slider: mongoose.model('Slider', sliderSchema),
  Notice: mongoose.model('Notice', noticeSchema),
  Profession: mongoose.model('Profession', professionSchema),
  Question: mongoose.model('Question', questionSchema),
  Student: mongoose.model('Student', studentSchema),
  Employment: mongoose.model('Employment', employmentSchema),
  Admission: mongoose.model('Admission', admissionSchema),
  College: mongoose.model('College', collegeSchema),
  Answer: mongoose.model('Info', infoSchema),
};

module.exports = Models;
