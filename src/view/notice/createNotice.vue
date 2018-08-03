<template>
    <div style="margin: 40px;">
        <el-form ref="form" :model="noticeForm" label-width="60px">
            <el-form-item label="名称">
                <el-input v-model="noticeForm.title" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="类型">
                <el-select v-model="noticeForm.type" placeXYXWholder="请选择类型" style="width: 178px;">
                    <el-option label="学院新闻" value="XYXW"></el-option>
                    <el-option label="招生公告" value="ZSGG"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主图">
                <el-upload
                        class="avatar-uploader"
                        action="//up.qbox.me/"
                        :show-file-list="false"
                        :on-success="handlePicSuccess"
                        :before-upload="beforePicUpload"
                        :data="tokenData">
                    <img v-if="noticeForm.url" :src="noticeForm.url" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
            </el-form-item>
            <!--<el-form-item label="内容">-->
                <!--<el-input-->
                        <!--type="textarea"-->
                        <!--autosize-->
                        <!--placeholder="请输入内容"-->
                        <!--v-model="noticeForm.content">-->
                <!--</el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="内容">
                <quill-editor ref="contentEditor"
                              v-model="noticeForm.content"
                              :config="editorOption"
                              @blur="onEditorBlur($event)"
                              @focus="onEditorFocus($event)"
                              @change="onEditorChange($event)"></quill-editor>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
                <el-button @click="handleCancel">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script type="text/ecmascript-6">
  import config from '../../utils/config';

  export default {
    data() {
      return {
        noticeItem: [],
        noticeForm: {
          title: '',
          type: '',
          url: '',
          content: ''
        },
        tokenData: {
          token: config.qiniuToken
        },
        editorOption: {
          modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{'header': 1}, {'header': 2}],
              [{'list': 'ordered'}, {'list': 'bullet'}],
              [{'script': 'sub'}, {'script': 'super'}],
              [{'indent': '-1'}, {'indent': '+1'}],
              [{'direction': 'rtl'}],
              [{'size': ['small', false, 'large', 'huge']}],
              [{'header': [1, 2, 3, 4, 5, 6, false]}],
              [{'font': []}],
              [{'color': []}, {'background': []}],
              [{'align': []}],
              ['clean'],
              ['link', 'image', 'video']
            ],
            syntax: {
              highlight: text => hljs.highlightAuto(text).value
            }
          }
        }
      }
    },
    created() {
      if (this.$route.params) {
        this.noticeForm.title = this.$route.params.notice_title;
        this.noticeForm.type = this.$route.params.notice_type;
        this.noticeForm.url = this.$route.params.notice_url;
        this.noticeForm.content = this.$route.params.notice_content;
      }
    },
    methods: {
      onEditorBlur(editor) {
      },
      onEditorFocus(editor) {
      },
      onEditorChange({editor, html, text}) {
        console.log(editor, html, text);
      },
      handleSubmit() {
        if (this.$route.params._id) {
          this.noticeForm = Object.assign(this.noticeForm, {id: this.$route.params._id});
        }
        this.axios.post('/api/notice/addNotice', this.noticeForm).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: '提交成功！'
            });
            this.$router.push({name: 'notice'});
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      handleCancel() {
        if (this.$route.params._id) {
          this.$router.back();
        } else {
          this.$router.go(0);
        }
      },
      handlePicSuccess(res, file) {
        console.log(res);
        this.noticeForm.url = 'http://ozwwcfemm.bkt.clouddn.com/' + res.key;
      },
      beforePicUpload(file) {
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isLt2M;
      }
    }
  }
</script>

<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px !important;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>