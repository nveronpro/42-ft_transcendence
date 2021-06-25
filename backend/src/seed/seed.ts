import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateMatchHistoryDto } from '../match-histories/dto/create-match-history.dto';

import { User } from '../users/entities/user.entity';
import { MatchHistory } from '../match-histories/entities/match-history.entity';

async function reset_db() {
    await MatchHistory.delete({});
    await User.delete({});
}

export async function seed() {

    await reset_db();

    const usrDto1 = new CreateUserDto();
    usrDto1.login = "User1Login";
    usrDto1.nickname = "User1Nickname";
    usrDto1.wins = 0;
    usrDto1.looses = 0;
    usrDto1.current_status = "none";

    const usrDto2 = new CreateUserDto();
    usrDto2.login = "User2Login";
    usrDto2.nickname = "User2Nickname";
    usrDto2.wins = 0;
    usrDto2.looses = 0;
    usrDto2.current_status = "none";

    const usrDto3 = new CreateUserDto();
    usrDto3.login = "User3Login";
    usrDto3.nickname = "User3Nickname";
    usrDto3.wins = 0;
    usrDto3.looses = 0;
    usrDto3.current_status = "none";

    const usrDto4 = new CreateUserDto();
    usrDto4.login = "User4Login";
    usrDto4.nickname = "User4Nickname";
    usrDto4.wins = 0;
    usrDto4.looses = 0;
    usrDto4.current_status = "none";

	const usrDto5 = new CreateUserDto();
    usrDto5.login = "User5Login";
    usrDto5.nickname = "User5Nickname";
    usrDto5.wins = 0;
    usrDto5.looses = 0;
    usrDto5.current_status = "none";

    const usrDto6 = new CreateUserDto();
    usrDto6.login = "User6Login";
    usrDto6.nickname = "User6Nickname";
    usrDto6.wins = 0;
    usrDto6.looses = 0;
    usrDto6.current_status = "none";

    const usrDto7 = new CreateUserDto();
    usrDto7.login = "User7Login";
    usrDto7.nickname = "User7Nickname";
    usrDto7.wins = 0;
    usrDto7.looses = 0;
    usrDto7.current_status = "none";

    const usrDto8 = new CreateUserDto();
    usrDto8.login = "User8Login";
    usrDto8.nickname = "User8Nickname";
    usrDto8.wins = 0;
    usrDto8.looses = 0;
    usrDto8.current_status = "none";

    const usrDto9 = new CreateUserDto();
    usrDto9.login = "User9Login";
    usrDto9.nickname = "User9Nickname";
    usrDto9.wins = 0;
    usrDto9.looses = 0;
    usrDto9.current_status = "none";

    const usrDtoOwen = new CreateUserDto();
    usrDtoOwen.login = "oroberts";
    usrDtoOwen.nickname = "Nickname_oroberts";
    usrDtoOwen.wins = 0;
    usrDtoOwen.looses = 0;
    usrDtoOwen.current_status = "none";

    let u1 = await User.create(usrDto1).save();
    let u2 = await User.create(usrDto2).save();
	let u3 = await User.create(usrDto3).save();
	let u4 = await User.create(usrDto4).save();
	let u5 = await User.create(usrDto5).save();
	let u6 = await User.create(usrDto6).save();
	let u7 = await User.create(usrDto7).save();
	let u8 = await User.create(usrDto8).save();
	let u9 = await User.create(usrDto9).save();
	let uOwen = await User.create(usrDtoOwen).save();


    console.log(u1.friends + " login: " + u1.login);
    // console.log(u2.friends + " login: " + u2.login);
	// console.log(u3.friends + " login: " + u3.login);
	// console.log(u4.friends + " login: " + u4.login);
	// console.log(u5.friends + " login: " + u5.login);
	// console.log(u6.friends + " login: " + u6.login);
	// console.log(u7.friends + " login: " + u7.login);
	// console.log(u8.friends + " login: " + u8.login);
	// console.log(u9.friends + " login: " + u9.login);


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
	uOwen = await User.findOne({ id: uOwen.id });

    u1.friends = [u2];
    await User.save(u1);

    console.log(u1.friends[0].login + " login: " + u1.login);
    console.log(u2.friends + " login: " + u2.login);

    const matchHisoryDto1 = new CreateMatchHistoryDto();
    matchHisoryDto1.score = "5-2";
    matchHisoryDto1.winner = u1;
	u1.wins++;
    matchHisoryDto1.looser = u2;
	u2.looses++;
    let matchHistory1 = await MatchHistory.create(matchHisoryDto1).save();


    const matchHisoryDto2 = new CreateMatchHistoryDto();
    matchHisoryDto2.score = "5-4";
    matchHisoryDto2.winner = u3;
	u3.wins++;
    matchHisoryDto2.looser = u2;
	u2.looses++;
    let matchHistory2 = await MatchHistory.create(matchHisoryDto2).save();


    const matchHisoryDto3 = new CreateMatchHistoryDto();
    matchHisoryDto3.score = "5-4";
    matchHisoryDto3.winner = u2;
	u2.wins++;
    matchHisoryDto3.looser = u4;
	u4.looses++;
    let matchHistory3 = await MatchHistory.create(matchHisoryDto3).save();


    const matchHisoryDto4 = new CreateMatchHistoryDto();
    matchHisoryDto4.score = "5-0";
    matchHisoryDto4.winner = u6;
	u6.wins++;
    matchHisoryDto4.looser = u8;
	u8.looses++;
    let matchHistory4 = await MatchHistory.create(matchHisoryDto4).save();



    const matchHisoryDto5 = new CreateMatchHistoryDto();
    matchHisoryDto5.score = "5-3";
    matchHisoryDto5.winner = u3;
	u3.wins++;
    matchHisoryDto5.looser = u6;
	u6.looses++;
    let matchHistory5 = await MatchHistory.create(matchHisoryDto5).save();



    const matchHisoryDto6 = new CreateMatchHistoryDto();
    matchHisoryDto6.score = "5-1";
    matchHisoryDto6.winner = u1;
	u1.wins++;
    matchHisoryDto6.looser = u9;
	u9.looses++;
    let matchHistory6 = await MatchHistory.create(matchHisoryDto6).save();



    const matchHisoryDto7 = new CreateMatchHistoryDto();
    matchHisoryDto7.score = "5-3";
    matchHisoryDto7.winner = u1;
	u1.wins++;
    matchHisoryDto7.looser = u8;
	u8.looses++;
    let matchHistory7 = await MatchHistory.create(matchHisoryDto7).save();



    const matchHisoryDto8 = new CreateMatchHistoryDto();
    matchHisoryDto8.score = "5-4";
    matchHisoryDto8.winner = u3;
	u3.wins++;
    matchHisoryDto8.looser = u4;
	u4.looses++;
    let matchHistory8 = await MatchHistory.create(matchHisoryDto8).save();



    const matchHisoryDto9 = new CreateMatchHistoryDto();
    matchHisoryDto9.score = "5-3";
    matchHisoryDto9.winner = u3;
	u3.wins++;
    matchHisoryDto9.looser = u7;
	u7.looses++;
    let matchHistory9 = await MatchHistory.create(matchHisoryDto9).save();



    const matchHisoryDtoO1 = new CreateMatchHistoryDto();
    matchHisoryDtoO1.score = "5-4";
    matchHisoryDtoO1.winner = uOwen;
	uOwen.wins++;
    matchHisoryDtoO1.looser = u4;
	u4.looses++;
    let matchHistoryO1 = await MatchHistory.create(matchHisoryDtoO1).save();


    const matchHisoryDtoO2 = new CreateMatchHistoryDto();
    matchHisoryDtoO2.score = "5-0";
    matchHisoryDtoO2.winner = u3;
	u3.wins++;
    matchHisoryDtoO2.looser = uOwen;
	uOwen.looses++;
    let matchHistoryO2 = await MatchHistory.create(matchHisoryDtoO2).save();


    const matchHisoryDtoO3 = new CreateMatchHistoryDto();
    matchHisoryDtoO3.score = "5-4";
    matchHisoryDtoO3.winner = u1;
	u1.wins++;
    matchHisoryDtoO3.looser = uOwen;
	uOwen.looses++;
    let matchHistoryO3 = await MatchHistory.create(matchHisoryDtoO3).save();


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

	uOwen.match_histories = [matchHistoryO1, matchHistoryO2, matchHistoryO3];
	// uOwen.match_histories = [matchHistoryO1];
	// uOwen.match_histories = [matchHistoryO2];
	// uOwen.match_histories = [matchHistoryO3];

	await User.save(u1);
	await User.save(u2);
	await User.save(u3);
	await User.save(u4);
	//await User.save(u5);
	await User.save(u6);
	await User.save(u7);
	await User.save(u8);
	await User.save(u9);
	await User.save(uOwen);





    //u1 = await User.findOne({ id: u1.id });
    //u1.match_histories = [matchHistory1];
    //await User.save(u1);

    console.log("MATCH HISTORY:")
    console.log(matchHistory1);
    console.log(u1.match_histories[0]);
	console.log ("--------------------END OF SEED------------------");


    //await reset_db();
}
