import Organigrama2 from './components/Organigrama/Organigrama'
import { OrganigramaProvider } from './context/OrganigramaContext'


function OrganigramaController() {
    return (
        <div>
            <OrganigramaProvider>
                <Organigrama2 />
            </OrganigramaProvider>
        </div>
    )
}

export default OrganigramaController
