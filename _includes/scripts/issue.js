   
/**
 * -------------------editor---------------------
 * */

    
 const { createEditor, createToolbar } = window.wangEditor
  
 const editorConfig = {
   //   'min-height': '1000px',
     MENU_CONF: {},
     placeholder: '请输入内容...',
     onChange(editor) {
       const html = editor.getHtml()
       console.log('editor content', html)
       // 也可以同步到 <textarea>
     }
 }
 editorConfig.MENU_CONF['uploadImage'] = {
   server: 'https://www.asnowtree.cn/user/file/editorupload',
   // server: 'user/file/upload',
   // form-data fieldName ，默认值 'wangeditor-uploaded-image'
   fieldName: 'file',

   // 单个文件的最大体积限制，默认为 2M
   maxFileSize: 5 * 1024 * 1024, // 1M

   // 最多可上传几个文件，默认为 100
   maxNumberOfFiles: 10,

   // 选择文件时的类型限制，默认为 ['image/*'] 。如不想限制，则设置为 []
   allowedFileTypes: ['image/*'],

   // 自定义上传参数，例如传递验证的 token 等。参数会被添加到 formData 中，一起上传到服务端。
   // meta: {
   //     token: 'xxx',
   //     otherKey: 'yyy'
   // },

   // 将 meta 拼接到 url 参数中，默认 false
   metaWithUrl: false,

   // 自定义增加 http  header
   headers: {
       // Accept: 'text/x-json',
       Accept: 'application/json',
       // 'Content-Type': 'application/json'
       // otherKey: 'xxx'
   },

   // 跨域是否传递 cookie ，默认为 false
   withCredentials: true,

   // 超时时间，默认为 10 秒
   timeout: 5 * 1000, // 5 秒
}

// editorConfig.readOnly = true;
   // editorConfig.maxLength = 1000;
   editorConfig.scroll = false;
   // editorConfig.min-height = 
 const editor = createEditor({
     selector: '#editor-container',
     html: '<p><br></p>',
     config: editorConfig,
     mode: 'default', // or 'simple'
 })
 
 const toolbarConfig = {}
 
 
 const toolbar = createToolbar({
     editor,
     selector: '#toolbar-container',
     config: toolbarConfig,
     mode: 'default', // or 'simple'
 })


 var issueList  = [];
 
 // const toolbar = DomEditor.getToolbar(editor)

const curToolbarConfig = toolbar.getConfig()

var commontInitFlag = [];
console.log( curToolbarConfig.toolbarKeys )

curToolbarConfig.excludeKeys = [
 'group-video'
   // 'headerSelect',
   // 'italic',
   // 'group-more-style' // 排除菜单组，写菜单组 key 的值即可
]


 // const uploadImageConfig = editor.getMenuConfig('uploadImage');
 // uploadImageConfig.MENU_CONF['uploadImage'] = {
 //    server: '/file/upload',
 // }



function  issue_list() {
    viewBack();
    $.ajax(
        {
            type: "GET",
            url:  window.location.origin +  "/user/issue/issue/page?limit=10",
            success: function (result) {
                var ISSUEHTMLCONTENT = '';
                if (result && result.success) {
                    var datalist = result.data.list;
                    if(datalist){
                        for(var i=0;i<datalist.length;i++){
                            var issueContent = datalist[i];
                            var issueId = issueContent.id;
                            ISSUEHTMLCONTENT = ISSUEHTMLCONTENT + 
                            '<div class="issueItem" id="issue-'+ issueId +'">' + 
                                '<hr/>' + 
                                '<div id="issue-title-' + issueId +'">' + issueContent.title + '</div>' + 
                                '<article class="issueDiv"  style="" onclick=' + '\'viewIssue("'+ issueId +'")\'' + ' id="issue-content-' + issueId +'">' +
                                    issueContent.content + 
                                '</article>' + 
                                '<div id="issue-foot-' + issueId +'">' + 
                                    '<div style="text-align:right;">' + 
                                    '<a title="赞、喜欢" style="color:darkgray;margin-left: 2rem;" onclick=\'ilike("'+ issueId +'")\' href="javascript:void(0)"><i id="like-' + issueId +'" class="fa fa-heart"></i>赞</a>' + 
                                    '<a title="评论"  style="color:darkgray;margin-left: 2rem;"  onclick=\'icomments("'+ issueId +'")\' href="javascript:void(0)"><i class="fa fa-comment"></i>评论</a>' +
                                    '<a title="分享" style="color:darkgray;margin-left: 2rem;"  onclick=\'ishare("'+ issueId +'")\' href="javascript:void(0)"><i class="fa fa-share"></i>分享</a>' + 
                                    '</div>'  +
                                '</div>' + 
                                '<div class="user-comments" style="display:none" id="issue-commont-table-' + issueId +'">' + '</div>' + 
                            '</div>';
                        }
                        document.getElementById("issue_list_data").innerHTML  =  ISSUEHTMLCONTENT;
                    }
                } else {
                    
                }
                console.log(result);

            }
        });
}
var editorIssueId = "";

function ilike(id){
    editorIssueId = id;
    if(userLogin != 1){
        window.alert("需要登录")
        return;
    }
    $.ajax(
        {
            type: "POST",
            url:  window.location.origin +  "/user/issue/userlike",
            dataType: "json",
            data: JSON.stringify(
                { 
                subjectId:editorIssueId,
                targetType: 2
                }
                ),
            contentType: "application/json",
            success: function (result) {
                if (result && result.success) {
                    var likeItem = document.getElementById("like-" +  id);
                    likeItem.classList.add("like");
                }


            }
        });
}
function icomments(id){

    if(userLogin != 1){
        window.alert("需要登录")
        return;
    }
    editorIssueId = id;
    viewIssue(id);

    var issueCommontDiv = document.getElementById("issue-commont");
    issueCommontDiv.style.display = 'block';

}

function submitCommont(){

    if(userLogin != 1){
        window.alert("需要登录")
        return;
    }

    var icommentContent = document.getElementById("i-commont-content").value;

    if(!icommentContent || icommentContent.length < 3){
        window.alert("请至少输入三个字符");
        return;
    }
    $.ajax(

        {
            type: "POST",
            url:  window.location.origin +  "/user/issue/usercomment",
            dataType: "json",
            data: JSON.stringify(
                { 
                "commentContent": icommentContent,
                commentSubjectId:editorIssueId,
                commentType: 2
                }
                ),
            contentType: "application/json",
            success: function (result) {
                if (result && result.success) {
                    var issueCommontDiv = document.getElementById("issue-commont");
                    issueCommontDiv.style.display = 'none';
                    commontInitFlag[editorIssueId] = false;
                    viewIssue(editorIssueId);
                }else{
                    if(result && result.msg){
                        window.alert(result.msg);
                    }
                    
                }


            }
        });
    
    

}

function ishare(id){
    console.log("分享" + id);
}

function viewIssue(id){

    editorIssueId = id;
    var elementId = "issue-content-" + id;
    var element001 = document.getElementById(elementId);

    element001.classList.remove("issueDiv");
    // var article = document.getElementById('article-issue-' + id);
    hideAll();
    var articleItem = document.getElementById('issue-' + id);
    articleItem.style.display = 'block';
    var commontTable = document.getElementById('issue-commont-table-' + id);
    if(!commontInitFlag[id]){
        $.ajax(
            {
                type: "GET",
                url:  window.location.origin +  "/user/issue/usercomment/page?limit=10&commentType=2&commentSubjectId=" + id,
                success: function (result) {
                    var ISSUEHTMLCONTENT = '';
                    if (result && result.success) {
                        var datalist = result.data.list;
                        if(datalist){
                            for(var i=0;i<datalist.length;i++){
                                var comment = datalist[i];
                                var comid = comment.id;
                                var userId = comment.userId;
                                ISSUEHTMLCONTENT = ISSUEHTMLCONTENT + 
                                '<div class="commentItem" id="comment-'+ comid +'">' + 
                                    '<div><span>' + comment.commentContent  + '</span></div>' +  
                                    '<div style="text-align:right;"><span>--用户' + userId + '</span>&nbsp;' +  comment.commentTime  + '</div>'+
                                '</div>';
                            }
                            commontTable.innerHTML  =  ISSUEHTMLCONTENT;
                            commontTable.style.display = 'block';
                        }
                    } 
                    console.log(result);
    
                }
            });
        commontInitFlag[id] = true;

    }
    commontTable.style.display = 'block';
    // element001.style.display = 'none';
    // var editContent = element001.innerHTML;
    // article.innerHTML = editContent;
    //  document.getElementById("issue_list").style.display = 'none';
    //  document.getElementById("issue_item_info").style.display = 'contents';

}
function showAll(){
    var articleList = document.querySelectorAll(".issueItem");
    articleList.forEach((item, index) => {
        item.style.display = 'block';
    });
}
function hideAll(){
    var articleList = document.querySelectorAll(".issueItem");
    articleList.forEach((item, index) => {
        item.style.display = 'none';
    });
}

function editIssue(id){
    editorIssueId = id;
    var elementId = "issue-content-" + id;
    var element001 = document.getElementById(elementId);

    var editContent = element001.innerHTML;
    editor.setHtml(editContent);
     document.getElementById("issue_editor").style.display = 'contents';
     document.getElementById("issue_list").style.display = 'none';
     var  info  = issueList[id];
     if(info){
        document.querySelector('[name="title"]').value = info.title;
        document.querySelector('[name="author"]').value = info.author;
     }
     
    
}

function addIssue(){
    if(userLogin != 1){
        window.alert("未登录");
        return;
    }
    
     document.getElementById("issue_editor").style.display = 'contents';
     document.getElementById("issue_list").style.display = 'none';
     document.getElementById("issue_item_info").style.display = 'none';
    
}


function  myissue() {
    if(userLogin != 1){
        window.alert("未登录");
        return;
    }
    viewBack();
    // issueDisplay();
    $.ajax(
        {
            type: "GET",
            url:  window.location.origin +  "/user/issue/issue/page?limit=10&myself=1",
            success: function (result) {
                var ISSUEHTMLCONTENT = '';
                if (result && result.success) {
                    var datalist = result.data.list;
                    
                    if(datalist && datalist.length > 0){
                        for(var i=0;i<datalist.length;i++){
                            
                            var issueContent = datalist[i];
                            var issueId = issueContent.id;
                            issueList[ issueId ]  = issueContent;
                            ISSUEHTMLCONTENT = ISSUEHTMLCONTENT + 
                            '<div class="issueItem" id="issue-'+ issueId +'">' + 
                                '<hr/>' + 
                                '<div id="issue-title-' + issueId +'">' + issueContent.title + '</div>' + 
                                '<div class="issueDiv" onclick=' + '\'editIssue("'+ issueId +'")\'' + ' id="issue-content-' + issueId +'">' +
                                    issueContent.content + 
                                '</div>' + 
                                '<div id="issue-foot-' + issueId +'">' + 
                                    '<div style="text-align:right;">' + 
                                    '<a title="赞、喜欢" style="color:darkgray;margin-left: 2rem;" onclick=\'ilike("'+ issueId +'")\' href="javascript:void(0)"><i class="fa fa-heart"></i>赞</a>' + 
                                    '<a title="评论"  style="color:darkgray;margin-left: 2rem;"  onclick=\'icomments("'+ issueId +'")\' href="javascript:void(0)"><i class="fa fa-comment"></i>评论</a>' +
                                    '<a title="分享" style="color:darkgray;margin-left: 2rem;"  onclick=\'ishare("'+ issueId +'")\' href="javascript:void(0)"><i class="fa fa-share"></i>分享</a>' + 
                                    '<a title="编辑" style="color:darkgray;margin-left: 2rem;"  onclick=\'editIssue("'+ issueId +'")\' href="javascript:void(0)"><i class="fa fa-edit"></i>编辑</a>' + 
                                    '<a title="删除" style="color:darkgray;margin-left: 2rem;"  onclick=\'deleteIssue("'+ issueId +'")\' href="javascript:void(0)"><i class="fa fa-times"></i>删除</a>' + 
                                    '</div>'  +
                                '</div>' + 
                            '</div>';
                        }
                        document.getElementById("issue_list_data").innerHTML  =  ISSUEHTMLCONTENT;
                    }else{
                        document.getElementById("issue_list_data").innerHTML  =  ' <div class="issueDiv" style="padding:30px;">没有记录</div> ';
                        // document.getElementById("issue_list_data").innerHTML  =  '<div class="issueItem"><div class="issueDiv">没有记录</div></div>';
                    }
                } else {
                    
                }
                console.log(result);

            }
        });
}


 
  var editorIssueId;
  function save(){
    var content_Html = editor.getHtml();
    var titleValue = document.querySelector('[name="title"]').value;
    var authorValue = document.querySelector(' [name="author"]').value;
    if( userLogin == 0){
        window.alert("请先登录");
        return;
    }
    $.ajax(
            {
                type: "POST",
                url:  window.location.origin +  "/user/issue/issue",
                dataType: "json",
                data: JSON.stringify(
                    { "content": content_Html,
                    id:editorIssueId,
                    title:titleValue,
                    author: authorValue
                    }
                    ),
                contentType: "application/json",
                success: function (result) {
                    if (result && result.success) {
                        document.querySelector('[name="title"]').value = '';
                        document.querySelector(' [name="author"]').value = '';
                        myissue();
                        issueBack();
                        // getUserInfo();
                    }


                }
            });

  }
  function deleteIssue(id){
    // var ids = 
    var r=confirm("确认删除吗!");
    if(r){
        $.ajax(
            {
                type: "DELETE",
                url:  window.location.origin +  "/user/issue/issue",
                dataType: "json",
                data: JSON.stringify([id]),
                contentType: "application/json",
                success: function (result) {
                    if (result && result.success) {
                        myissue();
                        issueBack();
                        // getUserInfo();
                    }


                }
            });
    }
    

  }
  
  function issueBack(){
    document.getElementById("issue_editor").style.display = 'none';
    document.getElementById("issue_item_info").style.display = 'none';
    document.getElementById("issue_list").style.display = 'contents';
}

function viewBack(){
    
    var elementId = "issue-content-" + editorIssueId;
    var element001 = document.getElementById(elementId);
    var issueCommontDiv = document.getElementById("issue-commont");
    issueCommontDiv.style.display = 'none';
    var commontTable = document.getElementById('issue-commont-table-' + editorIssueId);
    if(commontTable) {
        commontTable.style.display = 'none'
    }
    if(element001){
        element001.classList.add("issueDiv");
    }
    showAll();
    document.getElementById("issue_editor").style.display = 'none';
    document.getElementById("issue_item_info").style.display = 'none';
    document.getElementById("issue_list").style.display = 'contents';
}