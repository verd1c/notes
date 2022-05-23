

### Overriding functions
```
override type func(args)
{
    edit;
    super.Method();
    return;
}
```


### Samples

```
override void OnActivate(IEntity ent)
{
    SCR_BaseGameMode gameMode = SCR_BaseGameMode.Cast(GetGame().GetGameMode()); // Get the game mode for the end script
    Faction faction = GetGame().GetFactionManager().GetFactionByKey("FIA"); // Get the winning faction Key
    int fiaIndex = GetGame().GetFactionManager().GetFactionIndex(faction); // Get the winning faction key's index
    gameMode.EndGameMode(SCR_GameModeEndData.CreateSimple(SCR_GameModeEndData.ENDREASON_EDITOR_FACTION_VICTORY, 1, fiaIndex)); // End the mission!
};
```