# DEX API DB provisioning

## Introduction

The DB provisioning system found under `./src/seed/*` is designed after this [spike ticket](https://github.com/geniusyield/dex-api-server/issues/813). The structure allows for adding of new data without requiring logic changes. New data is added to `./src/seed/data` and the provisioning logic under `./src/seed/scripts` stays the same.

## Data groupings

Provisioning all tables at once adds to much complexity and little flexibility. It becomes difficult to tell which data for which project on what network has changed. On the other hand, creating unique files for each table becomes unnecessarily complicated since most of the time you want to provision lots of tables at the same time.

With this in mind, we decided to create groups of tables to be provisioned at the same time. As of writing, these are

### Common group

This group contain data that is not dependent on other data.

### Project group

This group is a pre-requisite for `OrderSale` and `Staking` groups because it provisions the `Project` model that is required for `OrderSaleProject` and `StakingProject`.

Because `Project` is dependent on `Asset`, that model is also provisioned by this group.

### OrderSale group

This group mainly provisions `OrderSaleProject` and is a pre-requisite for the Launchpad app.

### Staking group

This group provisions `StakingProject` and other staking related data and is a pre-requisite for the Staking app.

### Misc

Contains data that does not fit elsewhere, such as creation of a user for development purposes.

## Folder structure

### Data folder

The data structure is broken up into `projects`, `networks` and different groupings, such as `stakingGroup`. This grouping adds some duplication of data, but that is a trade-off we are making to avoid regression when changes are made. For example, we may want to try out data changes in `networks/preprod` before deciding on also making that same change in `networks/mainnet`. This easily allows for that and makes the changes very easy to review and push to production without unintended consequences.

### Scripts folder

The scripts mirror the groupings you find in the data folder. In contrast to the data folder, there is no structure for different networks and projects. This is because the scripts have been built in a way to run with these as inputs. For example, if you want to provision data for the Project group on `preprod` for the `GENS` project, run the following command:

```
yarn seed projectGroup --network preprod --project-name GENS
```

Or if you want to provision the common data for the same network:

```
yarn seed commonGroup --network preprod
```

As you can see common data is the same for all projects and thus does not accept a `projectName` flag.
You can see this reflected in the data structure.

For more examples, see [scripts root file](https://github.com/geniusyield/dex-api-server/tree/main/src/seed/scripts/index.ts) where they are all defined.

## Hierarchy

One piece of complexity when it comes to provisioning is the order in which data needs to be created.

For example, an `OrderSaleProject` requires the equivalent `Project` to be provisioned, which in turn require the related `Asset` to be provisioned.

We've tried to mitigate this issue by grouping data together, but some domain knowledge will be required when using these scripts. Further steps can be added such as creating scripts which contain a set of provisioning commands to create all data needed for an app in a certain environment.

## Adding new data

Adding new data for a hypotethical project Brilliant Gains (BRI) for the Staking App, assuming we want to provision for mainnet, will require a new `stakingProject` folder to be added under a new folder `projects/bri/stakingProject/mainnet`.
Inspecting the `StakingGroupExports` type in `./seed/types/stakingGroup/index.ts` we can see that the script will require at least the `stakingProject` folder to exist, and then 3 optional folders. When in doubt, look at how other projects are provisioned for reference.

```
export type StakingGroupExports = {
  stakingNftMintingDatas?: Seed.StakingNftMintingData[];
  stakingNfts?: Seed.StakingNft[];
  stakingProject: Seed.StakingProject;
  stakingProjectNfts?: Seed.StakingProjectNft[];
};
```

But as mentioned in prior in this document, a `StakingProject` has a dependency on a `Project`. So we will also need to add `projectGroup` folder under `projects/bri/projectGroup/mainnet`

Once we've added the required data, we can provision our new project like this:

```
yarn seed projectGroup --network MAINNET --project-name BRI
yarn seed stakingGroup --network MAINNET --project-name BRI
```

and we should be good to go, without any changes outside of `./seed/data`, making it easy and low risk to review and push to production!
