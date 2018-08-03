<template>
    <div style="margin: 40px;">
        <el-form ref="form" :model="planForm" label-width="60px">
            <el-form-item label="年份">
                <el-input v-model="planForm.vintage" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="发布信息">
                <quill-editor ref="contentEditor"
                              v-model="planForm.content"
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
  // import config from '../../utils/config';

  export default {
    data() {
      return {
        planForm: {
          type: 'LSJL',
          vantage: '',
          content: ''
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
        this.planForm.vintage = this.$route.params.admission_vintage;
        this.planForm.content = this.$route.params.admission_content;
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
          this.planForm = Object.assign(this.planForm, {id: this.$route.params._id});
        }
        this.axios.post('/api/admission/addAdmission', this.planForm).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: '提交成功！'
            });
            this.$router.push({name: 'admissionHistory'});
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
