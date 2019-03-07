package com.macxen.service;

import com.macxen.common.AbstractService;
import com.macxen.common.exception.BusinessException;
import com.macxen.common.request.in.FileInfo;
import com.macxen.common.request.in.merge.MergeContext;
import com.macxen.common.request.in.merge.MergeResult;
import com.macxen.dao.CustomerDao;
import com.macxen.dao.FeedBackInfoDao;
import com.macxen.domain.FeedBackInfo;
import com.macxen.file.client.FileClientService;
import com.macxen.utils.ChConstant;
import com.macxen.vo.FeedBackInfoVO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Created by Alan Fu on 2018/1/6.
 */
@Slf4j
@Transactional
@Service
public class FeedBackInfoService extends AbstractService {
    @Autowired
    private FeedBackInfoDao feedBackInfoDao;
    @Autowired
    private CustomerDao customerDao;
    @Autowired
    private FileClientService fileClientService;

    /**
     * 添加反馈意见
     * @return
     */
    public int save(FeedBackInfoVO feedBackInfo) throws BusinessException {
        FeedBackInfo feed =  new FeedBackInfo();
        MergeContext mCtx = MergeContext.createContext(feedBackInfo, feed);
        mCtx.setTargetGroup(ChConstant.USER_FILE_GROUP);
        MergeResult mResult = mergeMgr.merge(mCtx);
        List<FileInfo> files2Add = mResult.getFiles2Add();
        if (files2Add != null && files2Add.size() > 0) {
            files2Add.forEach(r -> {
                fileClientService.switchFileGroup(r, ChConstant.USER_FILE_GROUP);
            });
        }
        return feedBackInfoDao.insert(feed);
    }

    /**
     * 更新反馈意见信息
     * @param feedBackInfo
     * @return
     */
    public int update(FeedBackInfo feedBackInfo){
        return feedBackInfoDao.updateByPrimaryKey(feedBackInfo);
    }


}
