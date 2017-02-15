
const MariaSql = require('mariasql');

const client = new MariaSql({
			host: 'localhost',
			port: 3306,
			user : 'root',
			password : '123456',
			db: 'security'
});

module.exports = {
  login: function(email,password,onSuccess){
     const query = 'select u.id as id, u.firstName as firstName, u.lastName as lastName, u.email as email,	u.cityId as cityId, u.roleId as roleId, c.name as city  from user u join city c on u.cityId=c.id where u.email= :email and u.password= :password';
     client.query(query,{ email, password },function(error,result){
       onSuccess(error,result);
     })
  },
	listEvents: function(params,onSuccess){
		const query = 'select ev.id as id, ev.name as name, ev.description as description, ev.address as address from event ev join city ci on ci.id= :cityId where ev.cityId = :cityId';
		client.query(query,{ cityId: params.cityId,},function(error,result){
			onSuccess(error,result);
		})
	},
	listEventsBy: function(params,onSuccess){
		const query = 'select ev.id as id, ev.name as name, ev.description as description, ev.address as address from event ev join city ci on ci.id = :cityId where ev.name like :query and ev.cityId = :cityId';
		const obj = { cityId:params.cityId, query:`%${params.query}%`};
		console.log(" Query :",obj)
		client.query(query,obj,function(error,result){
			onSuccess(error,result);
		})
	},
	getEventById: function(eventId,onSuccess){
		const query = 'select * from event where id = :eventId';
		console.log(" Query :",query)
		client.query(query,{ eventId },function(error,result){
			onSuccess(error,result);
		})
	},
	getCommnetariesByEvent: function(eventId,onSuccess){
		const query = 'select co.*, us.firstName, us.lastName from commentary co join user us on co.userId=us.id where eventId = :eventId';
		console.log(" Query :",query);
		client.query(query,{ eventId },function(error,result){
			onSuccess(error,result);
		})
	},
	saveComment: function(params,onSuccess){
		const query = 'insert into commentary (description,userId,eventId) values (:commentary,:userId,:eventId)';
		console.log(" Query :",query)
		client.query(query,{ commentary: params.commentary, userId: params.userId, eventId:params.eventId },function(error,result){
			onSuccess(error,result);
		})
	}
}
