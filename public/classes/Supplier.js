var user = require('./User');

class Supplier extends user{
    constructor(username, email, phone, pass, user_ID, type, service_type, company_name, account_no)
    {
        super(username, email, phone, pass, user_ID, type);
        this.service_type = service_type;
        this.company_name = company_name;
        this.account_no = account_no;
    }

    //Supplier ID is static

    addItem(item){

        return("Item added!");
    }

    removeItem(item)
    {
        return("Item removed!");
    }

    show()
    {
        return("HELLO");
    }

    addService(service)
    {
        return("Service added")
    }

    removeService(item)
    {
        return("Item removed!");
    }

}
module.exports = Supplier;
