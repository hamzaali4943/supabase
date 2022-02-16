import useSupabase from 'src/boot/supabase'
import moment from 'moment'
export default function useApi() {
  const { supabase } = useSupabase()

  const list = async (table) => {
    const { data, error } = await supabase
      .from(table)
      .select('*')
    if (error) throw error
    return data
  }

  const getById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select(`* ,
      orditm:orditm ( * ),
      ordtrl:ordtrl ( ord_id)`)
      .eq('ord_id', id)
    if (error) throw error
    return data[0]
  }
  const getUnmatchFasitm = async (table = "fasitm") => {
    const { data, error } = await supabase
      .from(table)
      .select(`orl_upi,invDate, invRef, itemName`)
      .is('matchAt', null)
    if (error) throw error
    return data
  }

  const getUnmatchOdritm = async (table = "orditm") => {
    const { data, error } = await supabase
      .from(table)
      .select(`orl_upi,ord_createAt,ord_num,orl_itemName`)
      .is('matchAt', null)
      .not('orl_upi', 'eq', null)
    if (error) throw error
    return data
  }

  const autoMatchSingle = async (table = "orditm", id = "10833143496877") => {
    const { data, error } = await supabase
      .from(table)
      .select(`* ,
      fasitm:fasitm (orl_upi)`)
      .eq('orl_id', id)
    if (error) throw error
    console.log(data[0])
    if (data[0]) {
      await update("fasitm", { orl_upi: data[0].orl_upi, matchAt: moment().format("YYYY-MM-DD"), orl_id: data[0].ord_id })
      await update("orditm", { orl_upi: data[0].orl_upi, matchAt: moment().format("YYYY-MM-DD") })
    }
    return data[0]
  }

  const getMatchFasitm = async (table = 'fasitm', startDate, endDate, company) => {
    if (!startDate) {
      startDate = moment('2021/30/11', "YYYY-MM-DD").format("YYYY-MM-DD");
    }
    if (!endDate)
      endDate = moment().format("YYYY-MM-DD");

    let query = supabase
      .from(table)
      .select('*')
      .not('matchAt', 'eq', null)
      .order('matchAt', { ascending: false })
    if (company) { query = query.eq('company', company) }
    if (startDate) { query = query.gte('matchAt', startDate.toString()) }
    if (endDate) { query = query.lt('matchAt', endDate.toString()) }

    const { data, error } = await query;

    if (error) throw error
    return data
  }
  const getCommentsById = async (table, id) => {
    const { data, error } = await supabase
      .from(table)
      .select(`comments`)
      .eq('ord_id', id)
    if (error) throw error
    return data[0]
  }


  const post = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .insert([
        {
          ...form
        }
      ])
    if (error) throw error
    return data
  }

  const updateMatchAt = async (table, form) => {
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ orl_upi: form.orl_upi })
    if (error) throw error
    return data
  }

  const update = async (table, form) => {
    if (form.comments) {
      let previous = await getCommentsById(table, form.ord_id)
      if (previous.comments)
        previous = previous.comments;
      else
        previous = []
      form.comments = [...previous, form.comments]
    }
    const { data, error } = await supabase
      .from(table)
      .update({ ...form })
      .match({ ord_id: form.ord_id })
    if (error) throw error
    return data
  }

  const remove = async (table, ord_id) => {
    const { data, error } = await supabase
      .from(table)
      .delete()
      .match({ ord_id })
    if (error) throw error
    return data
  }

  const createOrUpdate = async (table, items) => {
    const { data, error } = await supabase
      .from(table)
      .upsert(items)
    if (error) {
      console.log(error)
      throw error
    }
    return data
  }

  const customLogic = async (table, items, file) => {
    let success = items.length

    //get list of matching ids
    if (table == 'ordhdr') {
      let ids = items.map(e => e.ord_id);
      const { data, error } = await supabase
        .from(table)
        .select('ord_id')
        .in('ord_id', ids)
      if (error) throw error
      if (data.length) {
        const ordtrl = items.filter(a => data.some(b => a.ord_id == b.ord_id));
        const { data1, error } = await supabase
          .from('ordtrl')
          .upsert(ordtrl)
        if (error) throw error
        success = success - ordtrl.length
      }
    } else if (table == 'fasitm') {
      items = items.filter(item => item.orl_upi != null);
      success = items.length;
    }

    await post("logs", { filename: file })
    await createOrUpdate(table, items);
    return { success: success }
  }

  const getByDate = async (table = 'ordhdr', startDate, endDate, company) => {
    if (!startDate) {
      startDate = moment('2021/4/12', "YYYY-MM-DD").format("YYYY-MM-DD");
    }
    if (!endDate)
      endDate = moment().format("YYYY-MM-DD");

    let query = supabase
      .from(table)
      .select('ord_id, ord_num, ord_createAt, ord_amtTotal, comments')
      .order('ord_id', { ascending: false })
    if (company) { query = query.eq('company', company) }
    if (startDate) { query = query.gte('ord_createAt', startDate.toString()) }
    if (endDate) { query = query.lt('ord_createAt', endDate.toString()) }

    const { data, error } = await query;

    if (error) throw error
    data.forEach(e => {
      if (e.comments)
        e.comments = true;
      else
        e.comments = false;

    })
    return data
  }


  return {
    list,
    getById,
    getCommentsById,
    post,
    update,
    remove,
    createOrUpdate,
    customLogic,
    getByDate,
    getMatchFasitm,
    getUnmatchFasitm,
    getUnmatchOdritm,
    autoMatchSingle
  }
}
