import { getSession } from "@/actions"

const CompanyPage = async () => {
    const session = await getSession();
    return (
        <div className='company'>
            <h1>
                Welcome to the company page
            </h1>
        </div>
    )
}

export default CompanyPage