const ui = new WebUIWindow('guipm', 'package://guipm/ui/index.html', new Vector2(jcmp.viewportSize.x, jcmp.viewportSize.y));
ui.autoResize = true;
ui.hidden = true;

jcmp.events.AddRemoteCallable('guipm/AddMessage', (id, entry) => {
    jcmp.ui.CallEvent('guipm/AddMessage', id, entry);
})

jcmp.events.AddRemoteCallable('guipm/AddPlayer', (id, name) => {
    AddPlayer(id, name);
})

jcmp.events.AddRemoteCallable('guipm/RemovePlayer', (id) => {
    jcmp.ui.CallEvent('guipm/RemovePlayer', id);
})

jcmp.events.AddRemoteCallable('guipm/InitPlayers', (data) => {
    data = JSON.parse(data);
    data.forEach(function(entry) 
    {
        AddPlayer(entry.id, entry.name);
    });
})

jcmp.ui.AddEvent('guipm/SendMessage', (message, id) => 
{
    message = message.substring(0, (message.length > 1000) ? 1000 : message.length);
    jcmp.events.CallRemote('guipm/SendMessage', message, id);
})

jcmp.ui.AddEvent('guipm/ToggleOpen', (open) => {
    jcmp.localPlayer.controlsEnabled = !open;
    if (open)
    {
        ui.BringToFront();
    }
})

jcmp.ui.AddEvent('guipm/Ready', () => {
    ui.hidden = false;
    jcmp.events.CallRemote('guipm/GUIReady');
    ReadSettings();
})


function AddPlayer(id, name)
{
    if (id != jcmp.localPlayer.networkId)
    {
        jcmp.ui.CallEvent('guipm/AddPlayer', id, name);
    }
}

const notify_on_setting = "guipm/notify_on";
const sound_on_setting = "guipm/sound_on";

jcmp.ui.AddEvent('guipm/UpdateSettings', (notify_on, sound_on) => {
    jcmp.settings.Set(notify_on_setting, notify_on);
    jcmp.settings.Set(sound_on_setting, sound_on);
})

function ReadSettings()
{
    let notify_on = true;
    let sound_on = true;

    if (!jcmp.settings.Exists(notify_on_setting))
    {
        jcmp.settings.Set(notify_on_setting, true);
    }

    if (!jcmp.settings.Exists(sound_on_setting))
    {
        jcmp.settings.Set(sound_on_setting, true);
    }

    notify_on = jcmp.settings.Get(notify_on_setting);
    sound_on = jcmp.settings.Get(sound_on_setting);

    if (typeof notify_on != 'boolean') 
    {
        notify_on = true;
        jcmp.settings.Delete(notify_on_setting);
    }

    if (typeof sound_on != 'boolean') 
    {
        sound_on = true;
        jcmp.settings.Delete(sound_on_setting);
    }

    jcmp.ui.CallEvent('guipm/SetSettings', notify_on, sound_on);

}