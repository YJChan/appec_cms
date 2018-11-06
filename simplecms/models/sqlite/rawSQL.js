const rawQuery = {
	getAdminsSQL: {
		params: [':1:', ':2:', ':3:', ':4:', ':5:', ':6:'],
		query: 'SELECT A.AdminID, A.AdminName, A.AdminEmail, A.level, ' + 
           'A.active, A.isMaster, A.RoleID, R.RoleName, A.createdAt, A.updatedAt, A.security_phase ' +
           'FROM Admins A LEFT JOIN Roles R ON R.RoleID = A.RoleID ' + 
           'WHERE A.isMaster=0 :1: :2: :3: :4: :5: :6: ',
		bindParam: function(obj){
			var sql = this.query;      
			if (obj.AdminName !== undefined && obj.AdminName !== null) {
				sql = sql.replace(':1:', ' AND A.AdminName LIKE \'%' + obj.AdminName + '%\' ');
			}else{
				sql = sql.replace(':1:', '');
			}
			if (obj.AdminEmail !== undefined && obj.AdminEmail !== null) {
				sql = sql.replace(':2:', ' AND A.AdminEmail LIKE \'%' + obj.AdminEmail + '%\' ');
			}else{
				sql = sql.replace(':2:', '');
			}
			if (obj.level !== undefined && obj.level !== null) {
				sql = sql.replace(':3:', ' AND A.level=' + obj.level + ' ');
			}else{
				sql = sql.replace(':3:', '');
			}
			if (obj.active !== undefined && obj.active !== null) {
				sql = sql.replace(':4:', ' AND A.active=' + obj.active + ' ');
			}else{
				sql = sql.replace(':4:', '');
			}
			if (obj.RoleName !== undefined && obj.RoleName !== null) {
				sql = sql.replace(':5:', ' AND R.RoleName LIKE \'%' + obj.RoleName + '%\' ');
			}else{
				sql = sql.replace(':5:', '');
			}
			if (obj.AdminID !== undefined && obj.AdminID !== null) {
				sql = sql.replace(':6:', ' AND A.AdminID LIKE \'%' + obj.AdminID + '%\' ');
			} else {
				sql = sql.replace(':6:', '');
			}
			return sql;
		},
		prepareSQL: function(){      
			var sql =  this.query;
			for(var n=1; n <= this.params.length; n++){
				var tmp = ':' + n + ':';
				sql = sql.replace(tmp, '');
			}

			return sql;
		}
	},
	queryPostKeyWordSQL: {
		params: ['$qry', '$qry', '$qry'],
		query: ' SELECT P.PostID, P.title, P.createdBy, C.catname FROM Posts P ' + 
           ' INNER JOIN PostCategories PC ON P.PostID = PC.PostID ' + 
           ' LEFT JOIN Categories C ON PC.CatID = C.CatID ' + 
           ' WHERE (P.title LIKE $qry) OR (P.content LIKE $qry) OR (C.catname LIKE $qry)',
		bindParam: function(obj){
			let sql = this.query;
			let completed = false;
			if(obj.queryText !== undefined && obj.queryText !== null){
				while(! completed){
					if(sql.indexOf('$qry') > -1){
						sql = sql.replace('$qry', obj.queryText);
					}else{
						completed = true;
					}          
				}				
			}
			return sql;
		},
		bindAndExecute: function(db, obj){
			return new Promise((resolve, reject) => {
				if(obj.queryText !== undefined && obj.queryText !== null){					
					db.query(this.query, {
						bind: {
							qry: '%' + obj.queryText + '%'
						}, type: db.QueryTypes.SELECT
					}).then(result => {
						resolve(result);
					}).catch(err => {
						reject(err);
					});
				}else{
					reject('Empty query text, nothing to search!');
				}
			});
		}
	}
};

module.exports = rawQuery;