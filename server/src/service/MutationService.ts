import MutationRepository from "../repository/MutationRepository";

class MutationService
{
    private mutationRepository: MutationRepository;

    constructor(mutationRepository: MutationRepository = new MutationRepository()) {
        this.mutationRepository = mutationRepository;
    }

    public getAllMutations()
    {
        // TODO post process mutations...
        return this.mutationRepository.findAllMutations();
    }
}

export default MutationService;
