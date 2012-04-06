var name;
var userid;
var otherName;
var buffer =[];
var $canvas = $("#thecanvas");
var ctx = $canvas[0].getContext('2d');
var isCanvasEnabled;
var access_token = $.cookie("fbauth");

function fbGetMe(cb){
	var url = "https://graph.facebook.com/me?access_token="+access_token;
	$.getJSON(url+"&callback=?",cb)
}
function fbGetFriends(cb){
	var url = "https://graph.facebook.com/me/friends?access_token="+access_token;
	$.getJSON(url+"&callback=?",cb)
}

// fbGetMe(function(user){
// 	if(user.name){
// 		name = user.name;
// 		userid = user.id;
// 		$("#navlogin").empty()
// 			.append("<img src='http://graph.facebook.com/" + userid + "/picture'/>")
// 			.append("<span>"+ name+"</span>");
// 		fbGetFriends(function(friends){
// 			var $friendsDiv = $("#friends").empty();
// 			for (var i = 0; i < friends.data.length; i++) {
// 				var friend = friends.data[i];
// 				$friendsDiv.append($("<li>")
// 					.append($("<a href='#drawarea'>")
// 						.append("<img src='http://graph.facebook.com/" + friend.id + "/picture'/>")
// 						.append("<span>"+ friend.name+"</span>"))
// 				);
// 			}
// 		});
// 	}
// });
function getUsers(){
	// actually get games and users
	$.getJSON("/gamesAndFriends",function(data){
		$("#friends").empty();
		for (var i = 0; i < data.friends.length; i++) {
			var user = data.friends[i];
			$("#friends").append($("<li><a href='#drawarea'>"+user.name +"</a></li>"));
		};
		
		$("#games").empty();
		for (var i = 0; i < data.games.length; i++) {
			var game = data.games[i];
			var $li = $("<li>");
			var $a = $("<a href='#drawarea'>"+game.drawFriend +" -> "+ game.answerFriend +"</a>").data("game", game);
			$li.append($a);
			$("#games").append($li);
				
		};
	});
}

function createGame(answerFriend,answerName){
	var postMessage ={
		  		answerFriend: answerFriend,
		  		answerName: answerName
			};
		$.post("/games.json",
			postMessage,
			function(data){
				if(data && data.game)
					startGame(data.game);
				else
					alert("error");
			}
		)
}

function startGame(game){
	$("#wordtitle").text(game.drawName + "->" + game.answerName);
	var $drawarea = $("#drawarea");
	var $games = $("#games");
	$games.slideUp(500,function(){$drawarea.slideDown(500)})
	$drawarea.data("game",game);
	if(game.drawData)
	{
		isCanvasEnabled = false;
		drawIt(JSON.parse(game.drawData));
	}
	else
	{
		$("#drawtools").show();
		isCanvasEnabled = true;
	}
}

$("#friends a, #games a").live("click",function(e){
	e.preventDefault(e);
	var $this = $(this);
	var game = $this.data("game");
	if(game){
		startGame(game);
	}
	else{
		var gameid = $this.data("gameid");
		$.get("/games/"+gameid + ".json",
			function(data){
				if(data && data.game)
					startGame(data.game);
				else
					alert("error");
			}
		)
	}
});

window.onmousedown = function () {
	if(isCanvasEnabled)
	{
    	isDown = 1;
    }
};
window.onmouseup = function () {
    isDown = 0;
    lastPoint = [];
};
$canvas.mousemove(function (e) {
    var offsetX = $canvas.position().left * -1;
    var offsetY = $canvas.position().top * -1;
    var point = [e.pageX + offsetX, e.pageY + offsetY]
    if (isDown) {
        if (!lastPoint)
            lastPoint = point;
        buffer.push({ c: "l", p1: lastPoint, p2: point });
        drawSection(lastPoint,point);
        lastPoint = point;
    }
});

$("#complete").click(function(e){
	e.preventDefault();
	var game = $("#drawarea").data("game");
	$.ajax("/games/update?id="+game.id, 
		{ data: {drawData: JSON.stringify(buffer)},
		  type: "PUT"
		});
});

function drawSection(point,lastPoint){
	ctx.beginPath();
    ctx.moveTo(lastPoint[0], lastPoint[1]);
	ctx.lineTo(point[0], point[1]);
    ctx.stroke();
}
function drawIt(drawData) {
	var ctx = $canvas[0].getContext('2d'),
		timeOffset = 0,
		timeStep = 20;
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, 10000, 10000);

	for (var i = 0; i < drawData.length; i++) {
	    var chunk = drawData[i];
	    if (chunk.c === "l") {
	        (function (chunk) {
	            window.setTimeout(function () {
	                drawSection(chunk.p1,chunk.p2);
	            }, timeOffset);
	        })(chunk);

	    }
	    else if (chunk.c === "c") {
	        (function (chunk) {
	            window.setTimeout(function () {
	                ctx.strokeStyle = chunk.cd;
	            }, timeOffset);
	        })(chunk);
	    }
	    timeOffset += timeStep;
	};
}

$(document).ready(function(){
	var friendNames = [];
	var friendLookup = [];
	var $friendTypeahead = $("#friendTypeahead");
	function setupTypeahead(){
		fbGetFriends(function(friends){
			if(friends && !friends.error){
				var $friendsDiv = $("#friends").empty();
				for (var i = 0; i < friends.data.length; i++) {
					var friend = friends.data[i];
					friendLookup[friend.name] = friend;
					// bug: duplicate friend names cant be resolved
					friendNames.push(friend.name);
				}

				$friendTypeahead.typeahead({"source": friendNames});
			}
		});
	}
	$("#friendTypeaheadOK").click(function(){
		var friend = friendLookup[$friendTypeahead.val()];
		createGame(friend.id, friend.name);
	});
	$("#startgamebtn").click(function(e){
		e.preventDefault();
		setupTypeahead();
		$("#friendTypeaheadForm").show();
	});
});