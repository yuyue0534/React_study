import { DesignerProvider } from "../state/designerContext";
import { FormDesigner } from "../designer/FormDesigner";

export default function App() {
    return (
        <DesignerProvider>
            <FormDesigner />
        </DesignerProvider>
    );
}
