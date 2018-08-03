/**
 * 编写接口
 */
"use strict";
const models = require('./db');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
// const crypto = require('crypto');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');  // 使用jwt签名

// router.use(expressJwt({secret: "secret"}).unless({path: ["/api/login"]}));
// router.use(function (err, req, res, next) {
//   console.log(err, req, res, next);
//   if (err.name === "UnauthorizedError") {
//     res.status(200).send({errorCode: 6, restbody: "token过期"});
//   }
// });

// router.use(function(req, res, next) {
//   // 拿取token 数据 按照自己传递方式写
//   var token = req.body.token || req.query.token || req.headers['x-access-token'];
//
//   if (token) {
//     // 解码 token (验证 secret 和检查有效期（exp）)
//     jwt.verify(token, 'myjwt', function(err, decoded) {
//       if (err) {
//         return res.json({ success: false, message: '无效的token.' });
//       } else {
//         // 如果验证通过，在req中写入解密结果
//         req.decoded = decoded;
//         //console.log(decoded)  ;
//         next(); //继续下一步路由
//       }
//     });
//   } else {
//     // 没有拿到token 返回错误
//     return res.status(403).send({
//       success: false,
//       message: '没有找到token.'
//     });
//   }
// });

/************** 创建(create) 读取(get) 更新(update) 删除(delete) **************/
// 管理员登录接口 ok
router.post('/api/login', (req, res) => {
  console.log('login', req.body);
  let id = req.body.adminId;
  let password = req.body.adminPass;
  let type = req.body.type;

  if (!id) {
    return res.status(400).send('id require');
  }
  if (!password) {
    return res.status(400).send('password require');
  }

  models.Admin.findOne({
    admin_id: id
  }, (err, data) => {
    console.log('enter', data);
    if (err) {
      res.send(err);
    } else {
      if (data) {
        if (data.admin_pass === password && data.admin_type === type) {
          var token = jwt.sign(data, 'myjwt', {
            expiresIn: 60 * 60 * 24  // 授权24小时
          });
          // res.send({status: 'OK', data: data});
          res.send({success: true, data: data, token: token});
        } else {
          res.send({success: false, msg: '密码或权限错误'});
          // res.send({errCode: 1, errMsg: "密码或权限错误"});
        }
      } else {
        res.send({success: false, msg: '用户不存在'});
        // res.send({errCode: 1, errMsg: "用户不存在"});
      }
    }
  });
});

// 获取管理员列表接口 ok 页面调试完成
router.get('/api/admin', (req, res) => {
  // 通过模型去查找数据库
  models.Admin.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({status: 'OK', data: data});
    }
  });
});

router.get('/api/admin/:id', (req, res) => {
  models.Admin.findById(req.params.id, (err, doc) => {
    if (err) {
      res.send({success: false, msg: '未找到该管理员信息'});
    }
    if (doc) {
      res.json({
        success: true,
        data: doc
      })
    }
  });
});

// 删除管理员 ok 页面调试完成
router.delete('/api/admin/:id', (req, res) => {
  console.log(req.params);
  return models.Admin.findById(req.params.id, (err, admin) => {
    if (!admin) {
      res.statusCode = 404;
      return res.send({errMsg: '未找到该管理员'});
    }
    return admin.remove((err) => {
      if (!err) {
        return res.json({
          success: true,
          msg: '删除成功'
        });
      } else {
        res.statusCode = 500;
        return res.send({errMsg: '服务器异常'});
      }
    });
  });
});

// 新增、编辑管理员接口 ok  页面调试完成
router.post('/api/admin/addNewAdmin', (req, res) => {
  console.log(req.body);
  let admin = new models.Admin({
    admin_id: req.body.adminId,
    admin_name: req.body.name,
    admin_phone: req.body.phone,
    admin_pass: req.body.pass,
    admin_type: req.body.type,
    admin_avatar: req.body.avatar
  });
  if (!req.body._id) {
    models.Admin.findOne({
      admin_id: req.body.adminId
    }, (err, data) => {
      console.log('新增', data);
      if (err) {
        res.send(err);
      } else {
        if (data) {
          return res.json({
            success: false,
            msg: '该工号已存在'
          });
        } else {
          models.Admin.create(admin)
            .then((data) => {
              res.json({
                success: true,
                msg: '添加成功'
              });
            });
        }
      }
    });
  } else {
    admin = Object.assign(admin, {_id: req.body._id});
    models.Admin.findByIdAndUpdate(req.body._id, {$set: admin})
      .then((data) => {
        console.log('admin update', data);
        res.json({
          success: true,
          msg: '编辑成功'
        });
      })
      .catch((err) => {
        console.log('err', err);
        res.json({
          success: false,
          msg: err
        });
      });
  }
});

// 获取轮播图列表接口 页面调试完成
router.get('/api/slider', (req, res) => {
  models.Slider.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      // 貌似有点累赘？？？
      // res.send({data: data});
      res.send({status: 'OK', data: data});
    }
  });
});

// 新增/编辑轮播图  新增ok 编辑ok 页面调试完成
router.post('/api/slider/addSlider', (req, res) => {
  let slider = {
    slider_pic: req.body.pic,
    slider_intro: req.body.intro
  };
  if (!req.body.id) {
    models.Slider.create(slider)
      .then((data) => {
        res.json({
          success: true,
          msg: '新增成功'
        });
      });
  } else {
    models.Slider.findByIdAndUpdate(req.body.id, {$set: slider})
      .then((data) => {
        console.log('slider update', data);
        res.json({
          success: true,
          msg: '编辑成功'
        });
      })
      .catch((err) => {
        console.log('err', err);
        res.json({
          success: false,
          msg: err
        });
      });
  }
});

// 删除轮播图 ok 页面调试完成
router.delete('/api/slider/:id', (req, res) => {
  return models.Slider.findById(req.params.id, (err, slider) => {
    if (!slider) {
      res.statusCode = 404;
      return res.send({errMsg: '不存在此轮播图'});
    }
    return slider.remove((err) => {
      if (!err) {
        return res.json({
          success: true,
          msg: '删除成功'
        });
      } else {
        res.statusCode = 500;
        return res.send({errMsg: '服务器异常'});
      }
    });
  });
});

// 获取公告内容列表  ok
router.get('/api/notice', (req, res) => {
  models.Notice.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({status: 'OK', data: data});
    }
  });
});

// 根据type查询内容列表
router.get('/api/notice/:type', (req, res) => {
  return models.Notice.find({notice_type: req.params.type}, (err, notice) => {
    if (err) {
      res.send(err);
    } else {
      res.send({success: true, data: notice});
    }
  });
});

// 新增/编辑内容  ok
router.post('/api/notice/addNotice', (req, res) => {
  let notice = {
    notice_type: req.body.type,
    notice_title: req.body.title,
    notice_url: req.body.url,
    notice_content: req.body.content
  };
  if (!req.body.id) {
    models.Notice.create(notice)
      .then((data) => {
        res.json({
          success: true,
          msg: '新增成功'
        });
      });
  } else {
    models.Notice.findByIdAndUpdate(req.body.id, {$set: notice})
      .then((data) => {
        console.log('notice update', data);
        res.json({
          success: true,
          msg: '编辑成功'
        });
      })
      .catch((err) => {
        console.log('err', err);
        res.json({
          success: false,
          msg: err
        });
      });
  }
});

// 根据id获取内容
router.get('/api/notice/:id', (req, res) => {
  return models.Notice.findById(req.params.id, (err, doc) => {
    console.log('getId', doc);
    if (err) return res.send(err);
    res.send({status: 'OK', data: doc});
  });
});

// 删除内容  ok
router.delete('/api/notice/:id', (req, res) => {
  return models.Notice.findById(req.params.id, (err, notice) => {
    if (!notice) {
      res.statusCode = 404;
      return res.send({errMsg: '未找到该内容'});
    }
    return notice.remove((err) => {
      if (!err) {
        return res.json({
          success: true,
          msg: '删除成功'
        });
      } else {
        res.statusCode = 500;
        return res.send({errMsg: '服务器异常'});
      }
    });
  });
});

// 获取专业分类列表 ok  页面调试完成
router.get('/api/profession', (req, res) => {
  return models.Profession.find()
    .populate('questions')
    .exec((err, doc) => {
      if (err) return next(err);
      console.log(doc);
      if (!doc) {
        res.statusCode = 404;
        return res.send({msg: '未找到该列表'});
      } else {
        res.send({status: 'OK', data: doc});
      }
    });
});

// 新增/编辑专业分类 ok 页面调试完成
router.post('/api/profession/addProfession', (req, res) => {
  let profession = {
    profession_name: req.body.name,
    profession_pic: req.body.pic,
    profession_desc: req.body.desc
  };
  if (!req.body.id) {
    models.Profession.create(profession)
      .then((data) => {
        res.json({
          success: true,
          msg: '新增成功'
        });
      });
  } else {
    models.Profession.findByIdAndUpdate(req.body.id, {$set: profession})
      .then((data) => {
        console.log('profession update', data);
        res.json({
          success: true,
          msg: '编辑成功'
        });
      })
      .catch((err) => {
        console.log('err', err);
        res.json({
          success: false,
          msg: err
        });
      });
  }
});

// 删除专业分类 关于删除此类之后专业详细信息也一并删除还未处理
router.delete('/api/profession/:id', (req, res) => {
  return models.Profession.findById(req.params.id, (err, profession) => {
    if (!profession) {
      res.statusCode = 404;
      return res.send({errMsg: '未找到该专业'});
    }
    return profession.remove((err) => {
      if (!err) {
        return res.json({
          success: true,
          msg: '删除成功'
        });
      } else {
        res.statusCode = 500;
        return res.send({errMsg: '服务器异常'});
      }
    });
  });
});

// 获取问题列表 ok  页面调试完成
router.get('/api/question', (req, res) => {
  models.Question.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({status: 'OK', data: data});
    }
  });
});

// 根据专业类型获取问题列表 ok 页面调试完成
router.get('/api/question/:professionId', (req, res) => {
  return models.Question.find({profession_id: req.params.professionId}, (err, doc) => {
    if (err) return res.send(err);
    res.send({status: 'OK', data: doc});
    // }
  });
});

// 新增/编辑问题 ok  页面调试完成
router.post('/api/question/addQuestion', (req, res) => {
  let question = {
    question_title: req.body.title,
    question_answer: req.body.answer,
    profession_id: req.body.professionId
  };
  models.Profession.findById(question.profession_id, (err, doc) => {
    if (err) {
      res.send(err);
    }
    console.log('profession', doc);
    if (doc) {
      question = Object.assign(question, {profession_name: doc.profession_name});
      let id = req.body.id;
      console.log('id', id, req.body.id);
      if (!id) {
        models.Question.create(question)
          .then((data) => {
            res.json({
              success: true,
              msg: '新增成功'
            });
          });
      } else {
        models.Question.findByIdAndUpdate(id, {$set: question})
          .then((data) => {
            console.log('update', data);
            res.json({
              success: true,
              msg: '编辑成功'
            });
          })
          .catch((err) => {
            console.log('err', err);
            res.json({
              success: false,
              msg: err
            });
          });
      }
    }
  });
});

// 删除问题  ok  页面调试完成
router.delete('/api/question/:id', (req, res) => {
  return models.Question.findById(req.params.id, (err, question) => {
    if (!question) {
      res.statusCode = 404;
      return res.send({errMsg: '未找到该问题'});
    }
    return question.remove((err) => {
      if (!err) {
        return res.json({
          success: true,
          msg: '删除成功'
        });
      } else {
        res.statusCode = 500;
        return res.send({errMsg: '服务器异常'});
      }
    });
  });
});

// 获取就业信息列表 ok
router.get('/api/employment', (req, res) => {
  models.Employment.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({status: 'OK', data: data});
    }
  });
});

// 新增/编辑就业信息 ok
router.post('/api/employment/addEmployment', (req, res) => {
  let employment = {
    employment_title: req.body.title,
    employment_content: req.body.content
  };
  if (!req.body.id) {
    models.Employment.create(employment)
      .then((data) => {
        res.json({
          success: true,
          msg: '新增成功'
        });
      });
  } else {
    models.Employment.findByIdAndUpdate(req.body.id, {$set: employment})
      .then((data) => {
        console.log('employment update', data);
        res.json({
          success: true,
          msg: '编辑成功'
        });
      })
      .catch((err) => {
        console.log('err', err);
        res.json({
          success: false,
          msg: err
        });
      });
  }
});

// 删除就业信息 ok
router.delete('/api/employment/:id', (req, res) => {
  console.log('req.params', req.params);
  return models.Employment.findById(req.params.id, (err, data) => {
    if (!data) {
      res.statusCode = 404;
      return res.send({errMsg: '未找到该内容'});
    }
    return data.remove((err) => {
      if (!err) {
        return res.json({
          success: true,
          msg: '删除成功'
        });
      } else {
        res.statusCode = 500;
        return res.send({errMsg: '服务器异常'});
      }
    });
  });
});

// 获取招生计划或历年分数
router.get('/api/admission/:type', (req, res) => {
  return models.Admission.find({admission_type: req.params.type}, (err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({success: true, data: data});
    }
  });
});

// 新增/编辑招生计划或历史记录
router.post('/api/admission/addAdmission', (req, res) => {
  let admission = {
    admission_type: req.body.type,
    admission_vintage: req.body.vintage,
    admission_content: req.body.content
  };
  if (!req.body.id) {
    models.Admission.create(admission)
      .then((data) => {
        res.json({
          success: true,
          msg: '新增成功'
        });
      });
  } else {
    models.Admission.findByIdAndUpdate(req.body.id, {$set: admission})
      .then((data) => {
        console.log('admission update', data);
        res.json({
          success: true,
          msg: '编辑成功'
        });
      })
      .catch((err) => {
        console.log('err', err);
        res.json({
          success: false,
          msg: err
        });
      });
  }
});

// 删除招生记录、历史记录
router.delete('/api/admission/:id', (req, res) => {
  console.log('req.params', req.params);
  return models.Admission.findById(req.params.id, (err, data) => {
    if (!data) {
      res.statusCode = 404;
      return res.send({errMsg: '未找到该内容'});
    }
    return data.remove((err) => {
      if (!err) {
        return res.json({
          success: true,
          msg: '删除成功'
        });
      } else {
        res.statusCode = 500;
        return res.send({errMsg: '服务器异常'});
      }
    });
  });
});

// 获取学生报名 ok 页面调试完成
router.get('/api/student', (req, res) => {
  models.Student.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({status: 'OK', data: data});
    }
  });
});

// 编辑学生录取信息 ok
router.post('/api/modifyStudent', (req, res) => {
  let isAdmitted = req.body.isAdmitted;
  let id = req.body.id;
  let answer = req.body.answer;
  let question = req.body.question;
  if (!id) {
    return res.status(400).send('id require');
  }
  models.Student.findByIdAndUpdate(id, {$set: {student_isAdmitted: isAdmitted, student_answer: answer, student_question: question}})
    .then((data) => {
      res.json({
        msg: '编辑成功',
        success: true
      });
    })
    .catch((err) => {
      console.log('err', err);
      res.json({
        msg: err,
        success: false
      });
    });
});

// 学生报名 ok (还需判断id是否重复)
router.post('/api/addStudent', (req, res) => {
  let student = {
    student_interested: req.body.interested,
    student_phone: req.body.phone,
    student_id: req.body.id,
    student_isAdmitted: '0',
    student_name: req.body.name,
    student_pass: req.body.pass,
  };
  models.Student.findOne({
    student_phone: req.body.phone
  }, (err, data) => {
    console.log('新增', data);
    if (err) {
      res.send(err);
    } else {
      if (data) {
        return res.json({
          success: false,
          msg: '该手机号已注册'
        });
      } else {
        models.Student.create(student)
          .then((data) => {
            res.json({
              success: true,
              msg: '新增成功'
            });
          });
      }
    }
  });
});

// 学生登录
router.post('/api/studentLogin', (req, res) => {
  console.log('login', req.body);
  let phone = req.body.phone;
  let password = req.body.pass;

  if (!phone) {
    return res.status(400).send('id require');
  }
  if (!password) {
    return res.status(400).send('password require');
  }

  models.Student.findOne({
    student_phone: phone
  }, (err, data) => {
    console.log('enter', data);
    if (err) {
      res.send(err);
    } else {
      if (data) {
        if (data.student_pass === password && data.student_phone === phone) {
          var token = jwt.sign(data, 'myjwt', {
            expiresIn: 60 * 60 * 24  // 授权24小时
          });
          // res.send({status: 'OK', data: data});
          res.send({success: true, data: data, token: token});
        } else {
          res.send({success: false, msg: '密码错误'});
        }
      } else {
        res.send({success: false, msg: '用户不存在'});
      }
    }
  });
});

// 查看学生信息
router.get('/api/student/:id', (req, res) => {
  models.Student.findById(req.params.id, (err, doc) => {
    if (err) {
      res.send({success: false, msg: '未找到该学生信息'});
    }
    if (doc) {
      res.json({
        success: true,
        data: doc
      })
    }
  });
});

// 学院信息查询类别查询
router.get('/api/getCollege', (req, res) => {
  models.College.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({status: 'OK', data: data});
    }
  });
});

// 学院信息新建与编辑
router.post('/api/college/addCollegeInfo', (req, res) => {
  let college = {
    college_title: req.body.title,
    college_content: req.body.content
  };
  if (!req.body.id) {
    models.College.create(college)
      .then((data) => {
        res.json({
          success: true,
          msg: '新增成功'
        });
      });
  } else {
    models.College.findByIdAndUpdate(req.body.id, {$set: college})
      .then((data) => {
        console.log('college update', data);
        res.json({
          success: true,
          msg: '编辑成功'
        });
      })
      .catch((err) => {
        console.log('err', err);
        res.json({
          success: false,
          msg: err
        });
      });
  }
});

// 删除学院实力内容
router.delete('/api/college/:id', (req, res) => {
  console.log('req.params', req.params);
  return models.College.findById(req.params.id, (err, data) => {
    if (!data) {
      res.statusCode = 404;
      return res.send({errMsg: '未找到该内容'});
    }
    return data.remove((err) => {
      if (!err) {
        return res.json({
          success: true,
          msg: '删除成功'
        });
      } else {
        res.statusCode = 500;
        return res.send({errMsg: '服务器异常'});
      }
    });
  });
});

// 根据id获取学院信息
router.get('/api/college/:id', (req, res) => {
  return models.College.find({_id: req.params._id}, (err, doc) => {
    if (err) return res.send(err);
    res.send({status: 'OK', data: doc});
  });
});

router.get('/api/info', (req, res) => {
  models.Answer.find((err, data) => {
    if (err) {
      res.send(err);
    } else {
      res.send({status: 'OK', data: data});
    }
  });
});

router.post('/api/info/addInfo', (req, res) => {
  let info = {
    student_id: req.body.id,
    answer: req.body.answer,
    question: req.body.question,
  };
  if (!req.body._id) {
    models.Answer.create(info)
      .then((data) => {
        res.json({
          success: true,
          msg: '新增成功'
        });
      });
  } else {
    models.Answer.findByIdAndUpdate(req.body.id, {$set: info})
      .then((data) => {
        console.log('college update', data);
        res.json({
          success: true,
          msg: '编辑成功'
        });
      })
      .catch((err) => {
        console.log('err', err);
        res.json({
          success: false,
          msg: err
        });
      });
  }
});

module.exports = router;
