
import { createCompany } from "@/actions"

const CreateCompany = () => {
    return(
        <form action={createCompany}>
            <input type="text" name="companyName" required placeholder="Company Name"/>
            <button>Create Company</button>
        </form>
    )
}

export default CreateCompany