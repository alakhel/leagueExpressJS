const state = {
    samUpdate(model) {

        this.samRepresent(model);
    },
    samRepresent(model) {
        let representation = '<h1>Oops! You Should Not get this :)</h1>';
        /*
        normalement on mis ici des conditions:
          avec attribute hasChanged. + the section (div.id)
          then we change hasChanged to false
        */
        //  if (model.hasChanged.fillIn)
        //    representation = view.newTeam(model, this);
        //if(model.token){


        switch (model.page.selected) {
            case 'Home':
                representation = view.home(model, this);
                break;
            case 'newTeam':
                representation = view.newTeam(model, this);
                break;
            case 'newMatch':

                representation = view.newMatch(model, this);
                break;
            case 'Live':
                representation = view.live(model, this);
                break;
            case 'Login':
                representation = view.login(model, this);
            default:

        }
        //}else representation = view.login(model, this);


        view.samDisplay(model.appId, representation);
    }
};