import mockMutations from '../../resources/mock/mutations.json';

class MutationRepository
{
    public findAllMutations(): any[] // TODO Mutation[]
    {
        // TODO read from file/database...
        return(mockMutations);
    }
}

export default MutationRepository;