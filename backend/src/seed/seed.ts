import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateMatchHistoryDto } from '../match-histories/dto/create-match-history.dto';

import { User } from '../users/entities/user.entity';
import { MatchHistory } from '../match-histories/entities/match-history.entity';
import { CreateFriendRequestDto } from '../friends/dto/create-friendRequest.dto';
import { FriendRequest } from '../friends/entities/friendRequest.entity';
import { avatars_64 } from '../ressources/avatar_default';

import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';

async function reset_db() {
	await FriendRequest.delete({});
    await MatchHistory.delete({});
    await User.delete({});
}

export async function seed() {

    await reset_db();

	//-------------USERS-------------

    const usrDto1 = new CreateUserDto();
    usrDto1.login = "User1Login";
    usrDto1.nickname = "User1Nickname";
    usrDto1.wins = 0;
    usrDto1.looses = 0;
    usrDto1.current_status = "none";
	usrDto1.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrDto2 = new CreateUserDto();
    usrDto2.login = "User2Login";
    usrDto2.nickname = "User2Nickname";
    usrDto2.wins = 0;
    usrDto2.looses = 0;
    usrDto2.current_status = "none";
	usrDto2.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrDto3 = new CreateUserDto();
    usrDto3.login = "User3Login";
    usrDto3.nickname = "User3Nickname";
    usrDto3.wins = 0;
    usrDto3.looses = 0;
    usrDto3.current_status = "none";
	usrDto3.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrDto4 = new CreateUserDto();
    usrDto4.login = "User4Login";
    usrDto4.nickname = "User4Nickname";
    usrDto4.wins = 0;
    usrDto4.looses = 0;
    usrDto4.current_status = "none";
	usrDto4.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

	const usrDto5 = new CreateUserDto();
    usrDto5.login = "User5Login";
    usrDto5.nickname = "User5Nickname";
    usrDto5.wins = 0;
    usrDto5.looses = 0;
    usrDto5.current_status = "none";
	usrDto5.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrDto6 = new CreateUserDto();
    usrDto6.login = "User6Login";
    usrDto6.nickname = "User6Nickname";
    usrDto6.wins = 0;
    usrDto6.looses = 0;
    usrDto6.current_status = "none";
	usrDto6.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrDto7 = new CreateUserDto();
    usrDto7.login = "User7Login";
    usrDto7.nickname = "User7Nickname";
    usrDto7.wins = 0;
    usrDto7.looses = 0;
    usrDto7.current_status = "none";
	usrDto7.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrDto8 = new CreateUserDto();
    usrDto8.login = "User8Login";
    usrDto8.nickname = "User8Nickname";
    usrDto8.wins = 0;
    usrDto8.looses = 0;
    usrDto8.current_status = "none";
	usrDto8.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrDto9 = new CreateUserDto();
    usrDto9.login = "User9Login";
    usrDto9.nickname = "User9Nickname";
    usrDto9.wins = 0;
    usrDto9.looses = 0;
    usrDto9.current_status = "none";
	usrDto9.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];


    const usrRequest1 = new CreateUserDto();
    usrRequest1.login = "RequestAcceptLogin";
    usrRequest1.nickname = "RequestAcceptNickname";
    usrRequest1.wins = 0;
    usrRequest1.looses = 0;
    usrRequest1.current_status = "none";
	usrRequest1.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrRequest2 = new CreateUserDto();
    usrRequest2.login = "RequestRefuseLogin";
    usrRequest2.nickname = "RequestRefuseNickname";
    usrRequest2.wins = 0;
    usrRequest2.looses = 0;
    usrRequest2.current_status = "none";
	usrRequest2.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

	const usrRequest3 = new CreateUserDto();
    usrRequest3.login = "RequestSentLogin";
    usrRequest3.nickname = "RequestSentNickname";
    usrRequest3.wins = 0;
    usrRequest3.looses = 0;
    usrRequest3.current_status = "none";
	usrRequest3.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

	const usrRequest4 = new CreateUserDto();
    usrRequest4.login = "RequestSent2Login";
    usrRequest4.nickname = "RequestSent2Nickname";
    usrRequest4.wins = 0;
    usrRequest4.looses = 0;
    usrRequest4.current_status = "none";
	usrRequest4.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrDtoOroberts = new CreateUserDto();
    usrDtoOroberts.login = "oroberts";
    usrDtoOroberts.nickname = "Nickname_oroberts";
    usrDtoOroberts.wins = 0;
    usrDtoOroberts.looses = 0;
    usrDtoOroberts.current_status = "none";
	usrDtoOroberts.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

    const usrDtoNveron = new CreateUserDto();
    usrDtoNveron.login = "nveron";
    usrDtoNveron.nickname = "Nickname_nveron";
    usrDtoNveron.wins = 0;
    usrDtoNveron.looses = 0;
    usrDtoNveron.current_status = "none";
	usrDtoNveron.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

	const usrDtoMavileo = new CreateUserDto();
    usrDtoMavileo.login = "mavileo";
    usrDtoMavileo.nickname = "Nickname_mavileo";
    usrDtoMavileo.wins = 0;
    usrDtoMavileo.looses = 0;
    usrDtoMavileo.current_status = "none";
	usrDtoMavileo.avatar = avatars_64[Math.floor(Math.random() * avatars_64.length)];

	var secretOroberts = speakeasy.generateSecret({
        name: usrDtoOroberts.login
	});

	usrDtoOroberts.secret = secretOroberts.ascii;
	usrDtoOroberts.qrcode_data = await qrcode.toDataURL(secretOroberts.otpauth_url);

	var secretNveron = speakeasy.generateSecret({
        name: usrDtoNveron.login
	});

	usrDtoNveron.secret = secretNveron.ascii;
	usrDtoNveron.qrcode_data = await qrcode.toDataURL(secretNveron.otpauth_url);

	var secretMavileo = speakeasy.generateSecret({
        name: usrDtoMavileo.login
	});

	usrDtoMavileo.secret = secretMavileo.ascii;
	usrDtoMavileo.qrcode_data = await qrcode.toDataURL(secretMavileo.otpauth_url);

	
    let u1 = await User.create(usrDto1).save();
    let u2 = await User.create(usrDto2).save();
	let u3 = await User.create(usrDto3).save();
	let u4 = await User.create(usrDto4).save();
	let u5 = await User.create(usrDto5).save();
	let u6 = await User.create(usrDto6).save();
	let u7 = await User.create(usrDto7).save();
	let u8 = await User.create(usrDto8).save();
	let u9 = await User.create(usrDto9).save();

	let ur1 = await User.create(usrRequest1).save();
	let ur2 = await User.create(usrRequest2).save();
	let ur3 = await User.create(usrRequest3).save();
	let ur4 = await User.create(usrRequest4).save();

	let uOroberts = await User.create(usrDtoOroberts).save();
	let uNveron = await User.create(usrDtoNveron).save();
	let uMavileo = await User.create(usrDtoMavileo).save();


    console.log(u1.friends + " login: " + u1.login);
    // console.log(u2.friends + " login: " + u2.login);
	// console.log(u3.friends + " login: " + u3.login);
	// console.log(u4.friends + " login: " + u4.login);
	// console.log(u5.friends + " login: " + u5.login);
	// console.log(u6.friends + " login: " + u6.login);
	// console.log(u7.friends + " login: " + u7.login);
	// console.log(u8.friends + " login: " + u8.login);
	// console.log(u9.friends + " login: " + u9.login);



	//-------------MATCHES-------------

    //await User.update(u1, { friends: [{id: u1.id}] });
    console.log("AFTER");

    u1 = await User.findOne({ id: u1.id });
	u2 = await User.findOne({ id: u2.id });
	u3 = await User.findOne({ id: u3.id });
	u4 = await User.findOne({ id: u4.id });
	u5 = await User.findOne({ id: u5.id });
	u6 = await User.findOne({ id: u6.id });
	u7 = await User.findOne({ id: u7.id });
	u8 = await User.findOne({ id: u8.id });
	u9 = await User.findOne({ id: u9.id });

	ur1 = await User.findOne({ id: ur1.id });
	ur2 = await User.findOne({ id: ur2.id });
	ur3 = await User.findOne({ id: ur3.id });
	ur4 = await User.findOne({ id: ur4.id });

	uOroberts = await User.findOne({ id: uOroberts.id });
	uNveron = await User.findOne({ id: uNveron.id });
	uMavileo = await User.findOne({ id: uMavileo.id });


	u1.match_histories = [];
	u2.match_histories = [];
	u3.match_histories = [];
	u4.match_histories = [];
	u5.match_histories = [];
	u6.match_histories = [];
	u7.match_histories = [];
	u8.match_histories = [];
	u9.match_histories = [];
	uOroberts.match_histories = [];
	uNveron.match_histories = [];
	uMavileo.match_histories = [];


    const matchHisoryDto1 = new CreateMatchHistoryDto();
    matchHisoryDto1.score = "5-2";
    matchHisoryDto1.winner = u1;
	u1.wins++;
    matchHisoryDto1.looser = u2;
	u2.looses++;
    let matchHistory1 = await MatchHistory.create(matchHisoryDto1).save();
	u1.match_histories.push(matchHistory1);
	u2.match_histories.push(matchHistory1);


    const matchHisoryDto2 = new CreateMatchHistoryDto();
    matchHisoryDto2.score = "5-4";
    matchHisoryDto2.winner = u3;
	u3.wins++;
    matchHisoryDto2.looser = u2;
	u2.looses++;
    let matchHistory2 = await MatchHistory.create(matchHisoryDto2).save();
	u3.match_histories.push(matchHistory2);
	u2.match_histories.push(matchHistory2);


    const matchHisoryDto3 = new CreateMatchHistoryDto();
    matchHisoryDto3.score = "5-4";
    matchHisoryDto3.winner = u2;
	u2.wins++;
    matchHisoryDto3.looser = u4;
	u4.looses++;
    let matchHistory3 = await MatchHistory.create(matchHisoryDto3).save();
	u2.match_histories.push(matchHistory3);
	u4.match_histories.push(matchHistory3);

    const matchHisoryDto4 = new CreateMatchHistoryDto();
    matchHisoryDto4.score = "5-0";
    matchHisoryDto4.winner = u6;
	u6.wins++;
    matchHisoryDto4.looser = u8;
	u8.looses++;
    let matchHistory4 = await MatchHistory.create(matchHisoryDto4).save();
	u6.match_histories.push(matchHistory4);
	u8.match_histories.push(matchHistory4);


    const matchHisoryDto5 = new CreateMatchHistoryDto();
    matchHisoryDto5.score = "5-3";
    matchHisoryDto5.winner = u3;
	u3.wins++;
    matchHisoryDto5.looser = u6;
	u6.looses++;
    let matchHistory5 = await MatchHistory.create(matchHisoryDto5).save();
	u3.match_histories.push(matchHistory5);
	u6.match_histories.push(matchHistory5);


    const matchHisoryDto6 = new CreateMatchHistoryDto();
    matchHisoryDto6.score = "5-1";
    matchHisoryDto6.winner = u1;
	u1.wins++;
    matchHisoryDto6.looser = u9;
	u9.looses++;
    let matchHistory6 = await MatchHistory.create(matchHisoryDto6).save();
	u1.match_histories.push(matchHistory6);
	u9.match_histories.push(matchHistory6);


    const matchHisoryDto7 = new CreateMatchHistoryDto();
    matchHisoryDto7.score = "5-3";
    matchHisoryDto7.winner = u1;
	u1.wins++;
    matchHisoryDto7.looser = u8;
	u8.looses++;
    let matchHistory7 = await MatchHistory.create(matchHisoryDto7).save();
	u1.match_histories.push(matchHistory7);
	u8.match_histories.push(matchHistory7);


    const matchHisoryDto8 = new CreateMatchHistoryDto();
    matchHisoryDto8.score = "5-4";
    matchHisoryDto8.winner = u3;
	u3.wins++;
    matchHisoryDto8.looser = u4;
	u4.looses++;
    let matchHistory8 = await MatchHistory.create(matchHisoryDto8).save();
	u3.match_histories.push(matchHistory8);
	u4.match_histories.push(matchHistory8);


    const matchHisoryDto9 = new CreateMatchHistoryDto();
    matchHisoryDto9.score = "5-3";
    matchHisoryDto9.winner = u3;
	u3.wins++;
    matchHisoryDto9.looser = u7;
	u7.looses++;
    let matchHistory9 = await MatchHistory.create(matchHisoryDto9).save();
	u3.match_histories.push(matchHistory9);
	u7.match_histories.push(matchHistory9);


    const matchHisoryDtoO1 = new CreateMatchHistoryDto();
    matchHisoryDtoO1.score = "5-4";
    matchHisoryDtoO1.winner = uOroberts;
	uOroberts.wins++;
    matchHisoryDtoO1.looser = u4;
	u4.looses++;
    let matchHistoryO1 = await MatchHistory.create(matchHisoryDtoO1).save();
	uOroberts.match_histories.push(matchHistoryO1);
	u4.match_histories.push(matchHistoryO1);

    const matchHisoryDtoO2 = new CreateMatchHistoryDto();
    matchHisoryDtoO2.score = "5-0";
    matchHisoryDtoO2.winner = u3;
	u3.wins++;
    matchHisoryDtoO2.looser = uOroberts;
	uOroberts.looses++;
    let matchHistoryO2 = await MatchHistory.create(matchHisoryDtoO2).save();
	u3.match_histories.push(matchHistoryO2);
	uOroberts.match_histories.push(matchHistoryO2);
	

    const matchHisoryDtoO3 = new CreateMatchHistoryDto();
    matchHisoryDtoO3.score = "5-4";
    matchHisoryDtoO3.winner = u1;
	u1.wins++;
    matchHisoryDtoO3.looser = uOroberts;
	uOroberts.looses++;
    let matchHistoryO3 = await MatchHistory.create(matchHisoryDtoO3).save();
	u1.match_histories.push(matchHistoryO3);
	uOroberts.match_histories.push(matchHistoryO3);



    const matchHisoryDtoO4 = new CreateMatchHistoryDto();
    matchHisoryDtoO4.score = "5-4";
    matchHisoryDtoO4.winner = uNveron;
	uNveron.wins++;
    matchHisoryDtoO4.looser = uOroberts;
	uOroberts.looses++;
    let matchHistoryO4 = await MatchHistory.create(matchHisoryDtoO4).save();
	uNveron.match_histories.push(matchHistoryO4);
	uOroberts.match_histories.push(matchHistoryO4);


    const matchHisoryDtoO5 = new CreateMatchHistoryDto();
    matchHisoryDtoO5.score = "5-2";
    matchHisoryDtoO5.winner = uOroberts;
	uOroberts.wins++;
    matchHisoryDtoO5.looser = uNveron;
	uNveron.looses++;
    let matchHistoryO5 = await MatchHistory.create(matchHisoryDtoO5).save();
	uOroberts.match_histories.push(matchHistoryO5);
	uNveron.match_histories.push(matchHistoryO5);
	


    const matchHisoryDtoO6 = new CreateMatchHistoryDto();
    matchHisoryDtoO6.score = "5-0";
    matchHisoryDtoO6.winner = u1;
	u1.wins++;
    matchHisoryDtoO6.looser = uNveron;
	uNveron.looses++;
    let matchHistoryO6 = await MatchHistory.create(matchHisoryDtoO6).save();
	u1.match_histories.push(matchHistoryO6);
	uNveron.match_histories.push(matchHistoryO6);


	const matchHisoryDtoO7 = new CreateMatchHistoryDto();
    matchHisoryDtoO7.score = "5-4";
    matchHisoryDtoO7.winner = uMavileo;
	uMavileo.wins++;
    matchHisoryDtoO7.looser = uNveron;
	uNveron.looses++;
    let matchHistoryO7 = await MatchHistory.create(matchHisoryDtoO7).save();
	uMavileo.match_histories.push(matchHistoryO7);
	uNveron.match_histories.push(matchHistoryO7);

	const matchHisoryDtoO8 = new CreateMatchHistoryDto();
    matchHisoryDtoO8.score = "5-0";
    matchHisoryDtoO8.winner = uNveron;
	uNveron.wins++;
    matchHisoryDtoO8.looser = uMavileo;
	uMavileo.looses++;
    let matchHistoryO8 = await MatchHistory.create(matchHisoryDtoO8).save();
	uNveron.match_histories.push(matchHistoryO8);
	uMavileo.match_histories.push(matchHistoryO8);

	const matchHisoryDtoO9 = new CreateMatchHistoryDto();
    matchHisoryDtoO9.score = "5-0";
    matchHisoryDtoO9.winner = u1;
	u1.wins++;
    matchHisoryDtoO9.looser = uMavileo;
	uMavileo.looses++;
    let matchHistoryO9 = await MatchHistory.create(matchHisoryDtoO9).save();
	u1.match_histories.push(matchHistoryO9);
	uMavileo.match_histories.push(matchHistoryO9);

/*
	u1.match_histories = [matchHistory1, matchHistory6, matchHistory7, matchHistoryO3];
	// u1.match_histories.push(matchHistory1);
	// u1.match_histories.push(matchHistory6);
	// u1.match_histories.push(matchHistory7);
	// u1.match_histories = [matchHistoryO3];

	u2.match_histories = [matchHistory1, matchHistory2, matchHistory3];
	// u2.match_histories.push(matchHistory1);
	// u2.match_histories.push(matchHistory2);
	// u2.match_histories.push(matchHistory3);

	u3.match_histories = [matchHistory2, matchHistory5, matchHistory8, matchHistory9, matchHistoryO2];
	// u3.match_histories.push(matchHistory2);
	// u3.match_histories.push(matchHistory5);
	// u3.match_histories.push(matchHistory8);
	// u3.match_histories.push(matchHistory9);
	// u3.match_histories = [matchHistoryO2];

	u4.match_histories = [matchHistory3, matchHistory8, matchHistoryO1];
	// u4.match_histories.push(matchHistory3);
	// u4.match_histories.push(matchHistory8);
	// u4.match_histories = [matchHistoryO1];

	u6.match_histories = [matchHistory4, matchHistory5];
	// u6.match_histories.push(matchHistory4);
	// u6.match_histories.push(matchHistory5);

	u7.match_histories = [matchHistory9];
	// u7.match_histories.push(matchHistory9);

	u8.match_histories = [matchHistory4, matchHistory7];
	// u8.match_histories.push(matchHistory4);
	// u8.match_histories.push(matchHistory7);

	u9.match_histories = [matchHistory6];
	// u9.match_histories.push(matchHistory6);

	uOroberts.match_histories = [matchHistoryO1, matchHistoryO2, matchHistoryO3];
	// uOroberts.match_histories = [matchHistoryO1];
	// uOroberts.match_histories = [matchHistoryO2];
	// uOroberts.match_histories = [matchHistoryO3];
*/

	//-------------FRIENDS-------------



	u1.friends = [uMavileo, uOroberts];
	u2.friends = [uNveron];
	u3.friends = [u6, uOroberts];
	u4.friends = [u6, u9, uMavileo, uNveron];
	u5.friends = [];
	u6.friends = [u3, u4, u9, uNveron];
	u7.friends = [u9, uNveron, uMavileo, uOroberts];
	u8.friends = [u9, uMavileo, uOroberts]
	u9.friends = [u4, u6, u7, u8, uOroberts];
	uOroberts.friends = [u1, u3, u7, u8, u9, uMavileo, uNveron];
	uNveron.friends = [u2, u4, u6, u7, uMavileo, uOroberts];
	uMavileo.friends = [u1, u4, u7, u8, uOroberts, uNveron];



	await User.save(u1);
	await User.save(u2);
	await User.save(u3);
	await User.save(u4);
	await User.save(u5);
	await User.save(u6);
	await User.save(u7);
	await User.save(u8);
	await User.save(u9);

	await User.save(ur1);
	await User.save(ur2);
	await User.save(ur3);
	await User.save(ur4);

	await User.save(uOroberts);
	await User.save(uNveron);
	await User.save(uMavileo);


	//-------------FRIEND REQUESTS-------------

    u1 = await User.findOne({ id: u1.id });
	u2 = await User.findOne({ id: u2.id });
	u3 = await User.findOne({ id: u3.id });
	u4 = await User.findOne({ id: u4.id });
	u5 = await User.findOne({ id: u5.id });
	u6 = await User.findOne({ id: u6.id });
	u7 = await User.findOne({ id: u7.id });
	u8 = await User.findOne({ id: u8.id });
	u9 = await User.findOne({ id: u9.id });

	ur1 = await User.findOne({ id: ur1.id });
	ur2 = await User.findOne({ id: ur2.id });
	ur3 = await User.findOne({ id: ur3.id });
	ur4 = await User.findOne({ id: ur4.id });

	uOroberts = await User.findOne({ id: uOroberts.id });
	uNveron = await User.findOne({ id: uNveron.id });
	uMavileo = await User.findOne({ id: uMavileo.id });
	
	console.log("creating friend requests !");

	const fr1_oroberts = new CreateFriendRequestDto();
	fr1_oroberts.sender = ur1;
	fr1_oroberts.receiver = uOroberts;

	const fr2_oroberts = new CreateFriendRequestDto();
	fr2_oroberts.sender = ur2;
	fr2_oroberts.receiver = uOroberts;

	const fr3_oroberts = new CreateFriendRequestDto();
	fr3_oroberts.sender = uOroberts;
	fr3_oroberts.receiver = ur3;

	const fr4_oroberts = new CreateFriendRequestDto();
	fr4_oroberts.sender = uOroberts;
	fr4_oroberts.receiver = ur4;


	const fr1_nveron = new CreateFriendRequestDto();
	fr1_nveron.sender = ur1;
	fr1_nveron.receiver = uNveron;

	const fr2_nveron = new CreateFriendRequestDto();
	fr2_nveron.sender = ur2;
	fr2_nveron.receiver = uNveron;

	const fr3_nveron = new CreateFriendRequestDto();
	fr3_nveron.sender = uNveron;
	fr3_nveron.receiver = ur3;

	const fr4_nveron = new CreateFriendRequestDto();
	fr4_nveron.sender = uNveron;
	fr4_nveron.receiver = ur4;


	const fr1_mavileo = new CreateFriendRequestDto();
	fr1_mavileo.sender = ur1;
	fr1_mavileo.receiver = uMavileo;

	const fr2_mavileo = new CreateFriendRequestDto();
	fr2_mavileo.sender = ur2;
	fr2_mavileo.receiver = uMavileo;

	const fr3_mavileo = new CreateFriendRequestDto();
	fr3_mavileo.sender = uMavileo;
	fr3_mavileo.receiver = ur3;

	const fr4_mavileo = new CreateFriendRequestDto();
	fr4_mavileo.sender = uMavileo;
	fr4_mavileo.receiver = ur4;

	console.log("saving friend requests !");

	await FriendRequest.create(fr1_oroberts).save();
	await FriendRequest.create(fr2_oroberts).save();
	await FriendRequest.create(fr3_oroberts).save();
	await FriendRequest.create(fr4_oroberts).save();

	await FriendRequest.create(fr1_nveron).save();
	await FriendRequest.create(fr2_nveron).save();
	await FriendRequest.create(fr3_nveron).save();
	await FriendRequest.create(fr4_nveron).save();

	await FriendRequest.create(fr1_mavileo).save();
	await FriendRequest.create(fr2_mavileo).save();
	await FriendRequest.create(fr3_mavileo).save();
	await FriendRequest.create(fr4_mavileo).save();

	// fr_1o = await FriendRequest.findOne({ id: fr_1o.id });

	// console.log("FriendRequest:" + fr_1o + ":[" + fr_1o.id + ", " + fr_1o.sender + ", " + fr_1o.receiver + "]");


    //u1 = await User.findOne({ id: u1.id });
    //u1.match_histories = [matchHistory1];
    //await User.save(u1);

    //console.log("MATCH HISTORY:")
    //console.log(matchHistory1);
    //console.log(u1.match_histories[0]);
	console.log ("--------------------END OF SEED------------------");



    //await reset_db();
}
