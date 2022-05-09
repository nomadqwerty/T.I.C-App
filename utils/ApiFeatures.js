// API features
class ApiFeatures{
    constructor(query,queryStr){
      this.query = query
      this.queryStr = queryStr
    }
    filter(){
      const queryObj = {...this.queryStr}
      const excludedFields = ['page','sort','limit','fields']  
      excludedFields.forEach(el=>{ delete queryObj[el]})
  
      let queryStr = JSON.stringify(queryObj)
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
      queryStr = JSON.parse(queryStr)
      
      this.query = this.query.find(queryStr)
  
      return this
    }
    sort(){
      if(this.queryStr.sort){
        // sort multiple fields
        let sortBy = this.queryStr.sort
        sortBy = sortBy.replace(/,/g,' ')
        this.query = this.query.sort(sortBy)
      }else{
        this.query = this.query.sort('-createdAt')
      } 
      return this
    }
    limitFields(){
      if(this.queryStr.fields){
        let fields = this.queryStr.fields
        fields = fields.replace(/,/g,' ')
        this.query = this.query.select(fields)
      }else{
        // exclude fields
        this.query = this.query.select('-__v')
      }
      return this
    }
    pagination(){
      const page = Number(this.queryStr.page)||1
      const limit = Number(this.queryStr.limit)||10
      const skip = (page-1)*limit
  
      this.query = this.query.skip(skip).limit(limit)
      
      return this
  
    }
}

module.exports = ApiFeatures
  