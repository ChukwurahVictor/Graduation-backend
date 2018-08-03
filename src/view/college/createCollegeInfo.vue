<template>
    <div style="margin: 40px;">
        <el-form ref="form" :model="collegeForm" label-width="60px">
            <el-form-item label="标题">
                <el-input v-model="collegeForm.title" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="发布信息">
                <quill-editor ref="contentEditor"
                              v-model="collegeForm.content"
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
        collegeForm: {
          title: '',
          content: ''
        },
        tokenData: {
          token: ''
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
        this.collegeForm.title = this.$route.params.college_title;
        this.collegeForm.content = this.$route.params.college_content;
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
          this.collegeForm = Object.assign(this.collegeForm, {id: this.$route.params._id});
        }
        this.axios.post('/api/college/addCollegeInfo', this.collegeForm).then((response) => {
          if (response.data.success) {
            this.$message({
              type: 'success',
              message: '提交成功！'
            });
            this.$router.push({name: 'college'});
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
