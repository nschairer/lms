export interface User {
    firstname: string;
    lastname:  string;
    email:     string;
}
export interface Lead {
    firstname: string;
    lastname:  string;
    email:     string;
    source:    string;
    phone:     string;
    history:   any[];
    events:    any[];
}
