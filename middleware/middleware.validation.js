module.exports = {
   isEmpty: function(data){
        error = {}
        for (key in data) {
            value = data[key]
            if (value.length == 0) {
                    error[key] = key + " cannot be empty"
            } 
        }

        if (Object.keys(error).length != 0) {
            let feedback = {
                status: false,
                error: error
            }
            return feedback
        }
        return {
            status: true
        }
   }
}
