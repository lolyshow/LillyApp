import NetworkUTIL from './Network'
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class APIS {

    netUTIL = new NetworkUTIL();
    baseURL = "https://www.nedumstudios.com/homemyhomeapi/api"
    token = ""
    id = ""

    constructor() {
        this.storageUserDetails()
    }

    async storageUserDetails(){
        const jsonValue = await AsyncStorage.getItem('@userdetails');
        jsonValue != null ? JSON.parse(jsonValue) : null;
        if(!jsonValue) return null;
        this.token = "Bearer " + jsonValue.api_token;
        this.id = jsonValue.id;
    }

    async searchUp(searchWord) {
        var res = await this.netUTIL.GET(this.baseURL + "/searchup?search=" + searchWord, this.token);

        return res
    }

    async getUsersProjects(id) {
        var res = await this.netUTIL.GET(this.baseURL + "/getusersprojects?id=" + id, this.token);
        return res;
    }

    async deleteSavedProject(id){
        var res = await this.netUTIL.GET(this.baseURL + "/deletesavedproject?id=" + id, this.token);
        return res;
    }

    async updateUsersProject(data){
        var res = await this.netUTIL.POST(this.baseURL + "/updateusersprojects", data ,this.token);

        return res;
    }

    async getProjectManagers() {
        var res = await this.netUTIL.GET(this.baseURL + "/getallprojectmanagers", this.token);

        return res;
    }

    async startMessage(data){
        var res = await this.netUTIL.POST(this.baseURL + "/sendmessage", data ,this.token);
        return res;
    }

    async addToCart(data){
        var res = await this.netUTIL.POST(this.baseURL + "/addtocart", data ,this.token);

        return res;
    }

    async login(email, password) {
        var res = await this.netUTIL.POST(this.baseURL + "/login", {
            email: email,
            password: password
        }, null);

        return res
    }

    async register(name, email, password) {
        var res = await this.netUTIL.POST(this.baseURL + "/register", {
            name: name,
            username: email,
            email: email,
            password: password
        }, null);

        return res
    }

    async makePayment(transaction) {
        var res = await this.netUTIL.POST(this.baseURL + "/makepayment", transaction, this.token);

        return res
    }

    async createProject(project) {
        var res = await this.netUTIL.POST(this.baseURL + "/createproject", project, this.token);

        return res
    }

    async getUsersId() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
                this.id = _res.id
            }
        })
    }

    async getUserDetails() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/getuserdetails", this.token);

        return res
    }

    async getLands() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/lands", this.token);

        return res
    }

    async getHouses() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/houses", this.token);

        return res
    }

    async getDesigns() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/designs", this.token);

        return res
    }

    async getFurnitures() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/furnitures", this.token);

        return res
    }

    async getFewLands() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/fewlands", this.token);

        return res
    }

    async getFewHouses() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/fewhouses", this.token);

        return res
    }

    async getOurMessages(userId, projectId){
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/ourmessages/" + message_token, this.token);

        return res
    }

    async getSendersMessages() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/sendersmessages/", this.token);

        return res
    }

    async getFewDesigns() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/fewdesigns", this.token);

        return res
    }

    async getFewFurnitures() {
        await AsyncStorage.getItem("@userdetails", (err, res) => {
            var _res = JSON.parse(res)

            if (res) {
                this.token = "Bearer " + _res.api_token
            }
        })

        var res = await this.netUTIL.GET(this.baseURL + "/fewfurnitures", this.token);

        return res
    }

    async updateUserDetails(user) {
        var res = await this.netUTIL.POST(this.baseURL + "/updateuser", user, this.token);

        return res
    }

}