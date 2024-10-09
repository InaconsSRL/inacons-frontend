import Organigrama from './components/Organigrama/Organigrama'
import { OrganigramaProvider } from './context/OrganigramaContext'


function OrganigramaController() {
    return (
        <div>
            <OrganigramaProvider>
                <Organigrama />
            </OrganigramaProvider>
        </div>
    )
}

export default OrganigramaController
