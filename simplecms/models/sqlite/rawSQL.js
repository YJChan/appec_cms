const rawQuery = {
  getAdminsSQL: {
    params: [':1:', ':2:', ':3:', ':4:', ':5:'],
    query: "SELECT A.AdminID, A.AdminName, A.AdminEmail, A.level, " + 
           "A.active, A.isMaster, A.RoleID, R.RoleName, A.createdAt, A.updatedAt " + 
           "FROM Admins A LEFT JOIN Roles R ON R.RoleID = A.RoleID " + 
           "WHERE A.isMaster =0 :1: :2: :3: :4: :5: ",
    bindParam: function(obj){
      var sql = this.query;
      if (obj.AdminName !== undefined && obj.AdminName !== null) {
        sql = sql.replace(":1:", " AND A.AdminName LIKE '%" + obj.AdminName + "%' ");
      }else{
        sql = sql.replace(":1:", "");
      }
      if (obj.AdminEmail !== undefined && obj.AdminEmail !== null) {
        sql = sql.replace(":2:", " AND A.AdminEmail LIKE '%" + obj.AdminEmail + "%' ");
      }else{
        sql = sql.replace(":2:", "");
      }
      if (obj.level !== undefined && obj.level !== null) {
        sql = sql.replace(":3:", " AND A.level=" + obj.level + " ");
      }else{
        sql = sql.replace(":3:", "");
      }
      if (obj.active !== undefined && obj.active !== null) {
        sql = sql.replace(":4:", " AND A.active=" + obj.active + " ");
      }else{
        sql = sql.replace(":4:", "");
      }
      if (obj.RoleName !== undefined && obj.RoleName !== null) {
        sql = sql.replace(":5:", " AND R.RoleName LIKE '%" + obj.RoleName + "%' ");
      }else{
        sql = sql.replace(":5:", "");
      }

      return sql;
    },
    prepareSQL: function(){      
      var sql =  this.query;
      for(var n=1; n <= this.params.length; n++){
        var tmp = ':' + n + ':';
        sql = sql.replace(tmp, "");
      }

      return sql;
    }
  }
};

module.exports = rawQuery;