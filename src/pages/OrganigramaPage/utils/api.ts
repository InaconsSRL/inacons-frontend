const API_URL = "https://offline.smartaccesorios.shop/.organiobra/api.php";

export const fetchProjects = async () => {
    const response = await fetch(`${API_URL}?action=getProjects`);
    return await response.json();
};

export const fetchPeople = async () => {
    const response = await fetch(`${API_URL}?action=getPeople`);
    return await response.json();
};

export const assignPersonToRole = async (projectId: string, roleId: string, personId: string) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'assignPersonToRole',
            projectId,
            roleId,
            personId,
        }),
    });
    return await response.json();
};

export const unassignPersonFromRole = async (projectId: string, roleId: string, personId: string) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            action: 'unassignPersonFromRole',
            projectId,
            roleId,
            personId,
        }),
    });
    return await response.json();
};