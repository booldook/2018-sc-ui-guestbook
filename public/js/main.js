var config = {
	apiKey: "AIzaSyB9CWBjGuakDhwgp417w3UCGVF_nmq8n4c",
	authDomain: "booldook-guestbook.firebaseapp.com",
	databaseURL: "https://booldook-guestbook.firebaseio.com",
	projectId: "booldook-guestbook",
	storageBucket: "booldook-guestbook.appspot.com",
	messagingSenderId: "590920722293"
};
firebase.initializeApp(config);

/***** 전역변수 선언 ******/
var auth = firebase.auth();
var db = firebase.database();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var ref;
var user;
var key = '';

/***** 구글 로그인 클릭 ******/
$(".login button").on("click", function(){
	auth.signInWithRedirect(googleAuth);
});
auth.onAuthStateChanged(function(result){
	if(result) {
		user = result;
		init();
	}
	else {
		$(".login").show();
		$(".wrap").hide();
		$(".lists").empty();
	}
});
$(".logout").click(function(){
	auth.signOut();
});

/***** 구글 로그인 후 초기셋팅 ******/
function init() {
	$(".login").hide();
	$(".wrap").show();
	$(".lists").empty();
	ref = db.ref("root/memos/");
	ref.on("child_added", onAdd);
	ref.on("child_removed", onRev);
}
function onAdd(data) {
	var id = data.key;
	var val = data.val();
	var html = '';
	html += '<li id="'+id+'">';
	html += '<h4>'+val.content+'</h4>';
	html += '<h5>'+val.email+'</h5>';
	html += '<button onclick="revData(this);"><i class="fa fa-trash"></i></button>';
	html += '</li>';
	$(".lists").prepend(html);
}
function onRev(data) {
	$("#"+data.key).remove();
}
$("#bt_wr").click(function(){
	var content = $("#content").val();
	if(content == "") {
		alert("내용을 입력하세요.");
		$("#content").focus();
	}
	else {
		ref = db.ref("root/memos/");
		ref.push({
			content: content,
			wdate: new Date().getTime(),
			email: user.email
		}).key;
		$("#content").val("");
	}
});
function revData(obj){
	var id = $(obj).parent().attr("id");
	if($(obj).parent().find("h5").html() == user.email) {
		ref = db.ref("root/memos/"+id);
		ref.remove();
	}
	else {
		alert("타인의 글은 삭제할 수 없습니다.");
	}
}