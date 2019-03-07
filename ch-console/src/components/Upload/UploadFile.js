import React from 'react';
import {message,Upload,notification,Button } from 'antd';


class UploadFile extends React.Component {

  //导入
  handleImport = (info) => {
    // 正在导入时显示一个提示信息
    if (info.file.status === 'uploading') {
      if (!this.hideLoading) {
        let hide = message.loading('正在导入...');
        this.hideLoading = hide;
      }
    }
    // 导入完成, 无论成功或失败, 必须给出提示, 并且要用户手动关闭
    else if (info.file.status === 'error') {
      this.hideLoading();
      this.hideLoading = undefined;
      notification.error({
        message: '导入失败',
        description: '文件上传失败, 请联系管理员',
        duration: 0,
      });
    }
    // done的情况下还要判断返回值
    else if (info.file.status === 'done') {
      this.hideLoading();
      this.hideLoading = undefined;
      logger.debug('upload result %o', info.file.response);
      if (!info.file.response.success) {
        notification.error({
          message: '导入失败',
          description: `请联系管理员, 错误信息: ${info.file.response.message}`,
          duration: 0,
        });
      } else {
        notification.success({
          message: '导入成功',
          description: info.file.response.data,
          duration: 0,
        });
      }
    }
  };


  render() {
    const {url} = this.props;
    // 上传相关配置
    const uploadProps = {
      name: 'file',
      action: url,
      showUploadList: false,
      onChange: this.handleImport,
    };

    return (
        <Upload {...uploadProps}><Button icon='upload' type="primary">导入</Button></Upload>
    );
  }


}

export default UploadFile;
